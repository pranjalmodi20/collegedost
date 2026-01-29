const fs = require('fs');
const csv = require('csv-parser');
const College = require('../../models/College.model'); // Adjust path if needed
const { findBestMatch } = require('./ingestion.utils');

/**
 * Processes AICTE CSV and updates College database.
 * @param {String} filePath - Absolute path to the CSV file
 * @param {String} year - Academic Year (e.g., "2024-2025")
 * @param {Object} logEntry - Mongoose document for checking stats
 */
const processAicteCsv = (filePath, year, logEntry) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = fs.createReadStream(filePath).pipe(csv());
    
    // Cache colleges for performance (if memory allows, otherwise use batched queries)
    // For 60k colleges, loading only names/aliases/_id is ~5-10MB. Feasible.
    let collegesCache = [];

    stream.on('headers', (headers) => {
       // Validate headers if needed
       console.log('AICTE CSV Headers:', headers);
    });

    stream.on('data', (data) => results.push(data));

    stream.on('end', async () => {
      try {
        console.log(`Parsed ${results.length} rows. Starting processing...`);
        logEntry.stats.totalRecords = results.length;
        await logEntry.save();

        // 1. Load all colleges (projection: name aliases ingestionMetadata coursesOffered)
        collegesCache = await College.find({}, 'name aliases ingestionMetadata location.state coursesOffered').lean();
        
        // 2. Process each row
        // Group by Institute to minimize DB writes? 
        // AICTE CSV is usually one row per course per institute.
        // Better: Group rows by 'Institute Name' or 'AICTE ID', then process each institute.
        
        const instituteGroups = {};
        
        for (const row of results) {
          // Adjust these keys based on actual CSV headers
          const instituteId = row['Application Number'] || row['AICTE ID']; 
          const instituteName = row['Institute Name'];
          
          if (!instituteId) continue; // Skip bad rows

          if (!instituteGroups[instituteId]) {
            instituteGroups[instituteId] = {
              meta: row,
              courses: []
            };
          }
          
          instituteGroups[instituteId].courses.push({
            courseName: row['Course'],
            level: row['Level'],
            intake: parseInt(row['Approved Intake'] || '0', 10),
            duration: row['Duration'] || '', // Sometimes present
            aicteId: instituteId
          });
        }

        const stats = { matched: 0, updated: 0, failed: 0 };
        const bulkOps = [];

        for (const [aicteId, data] of Object.entries(instituteGroups)) {
           const { meta, courses } = data;
           const name = meta['Institute Name'];
           const state = meta['State'];
           
           // 1. Try finding by AICTE ID
           let match = collegesCache.find(c => c.ingestionMetadata?.aicteId === aicteId);

           // 2. If not, fuzzy match
           if (!match) {
             const fuzzy = findBestMatch(name, collegesCache, 0.85);
             if (fuzzy) {
               match = fuzzy.college;
               // If found by name, we should link the AICTE ID now!
             }
           }

           if (match) {
             stats.matched++;
             
             // Update Metadata
             match.ingestionMetadata = match.ingestionMetadata || {};
             match.ingestionMetadata.aicteId = aicteId;
             match.ingestionMetadata.lastEnrichedAt = new Date();
             
             // Process Courses
             // We need to fetch the full document to update the array safely OR use findOneAndUpdate per college.
             // BulkWrite with array merging is complex. Let's do findOneAndUpdate for reliability.
             // For 60k colleges, this might be slow, but for 3-4k engineering colleges it's fine.
             
             const existingCourses = match.coursesOffered || [];
             const newCoursesList = [...existingCourses];

             for (const newCourse of courses) {
                // Check if exists
                const existingIndex = newCoursesList.findIndex(c => 
                    c.courseName.toLowerCase() === newCourse.courseName.toLowerCase() && 
                    c.level === newCourse.level
                );

                if (existingIndex > -1) {
                    // Update
                    newCoursesList[existingIndex].intake = newCourse.intake;
                    newCoursesList[existingIndex].aicteId = newCourse.aicteId;
                    newCoursesList[existingIndex].duration = newCourse.duration; // "4 Years"
                    // Preserve other fields like fee, eligibility if they exist
                } else {
                    // Add New
                    newCoursesList.push({
                        courseName: newCourse.courseName,
                        level: newCourse.level,
                        intake: newCourse.intake,
                        duration: newCourse.duration,
                        aicteId: newCourse.aicteId,
                        fee: 0, 
                        seats: newCourse.intake // Map intake to seats
                    });
                }
             }

             // Add simplified update op
             bulkOps.push({
                 updateOne: {
                     filter: { _id: match._id },
                     update: { 
                         $set: { 
                             "ingestionMetadata": match.ingestionMetadata,
                             "coursesOffered": newCoursesList
                         }
                     }
                 }
             });

           } else {
             stats.failed++;
             logEntry.logs.push(`Skipped: ${name} (${aicteId}) - No match found`);
           }
        }
        
        // Execute Bulk Update (Chunks of 1000)
        if (bulkOps.length > 0) {
           console.log(`Executing detailed update for ${bulkOps.length} colleges...`);
           // Mongoose bulkWrite might timeout if too large. Batch it.
           const BATCH_SIZE = 500;
           for (let i = 0; i < bulkOps.length; i += BATCH_SIZE) {
               const chunk = bulkOps.slice(i, i + BATCH_SIZE);
               await College.bulkWrite(chunk);
               console.log(`Processed batch ${i} - ${i + chunk.length}`);
           }
        }
        
        // Final Stats
        logEntry.stats.matched = stats.matched;
        logEntry.stats.failed = stats.failed;
        logEntry.status = 'COMPLETED';
        await logEntry.save();
        
        resolve(stats);
      } catch (err) {
        reject(err);
      }
    });

    stream.on('error', (err) => reject(err));
  });
};

module.exports = { processAicteCsv };
