const fs = require('fs');
const path = require('path');

// Load colleges from JSON file
const loadCollegesFromFile = () => {
  try {
    // Navigate up from src/controllers -> src -> backend -> root
    const jsonPath = path.join(__dirname, '../../../careers360_colleges.json');
    console.log("Loading colleges from:", jsonPath);
    
    if (!fs.existsSync(jsonPath)) {
        console.error("JSON file not found at:", jsonPath);
        return [];
    }
    
    const jsonData = fs.readFileSync(jsonPath, 'utf-8');
    const rawColleges = JSON.parse(jsonData).colleges;
    console.log(`Successfully loaded ${rawColleges.length} colleges from file.`);

    // Transform and add Dummy Cutoffs just like the import script
    return rawColleges.map((college, index) => {
       // Parse Location
       let city = 'Unknown';
       let state = 'India';
       if (college.location) {
           const parts = college.location.split(',');
           if (parts.length > 1) {
               city = parts[0].trim();
               state = parts[1].trim();
           } else {
               state = parts[0].trim();
           }
       }

       // Generate Dummy Cutoffs
       const isGovt = college.ownership && (college.ownership.includes('Govt') || college.ownership.includes('Public'));
       const basePercentile = isGovt ? 90 : 70;
       
       const generateCutoff = (branch, category, base) => {
         // Use a deterministic "random" based on name length to keep it consistent across reloads
         const seed = (college.name.length + branch.length + category.length) % 10;
         let p = base + seed; 
         if (category === 'OBC') p -= 2;
         if (category === 'SC') p -= 10;
         if (category === 'ST') p -= 15;
         return Math.min(99.9, Math.max(40, parseFloat(p.toFixed(2))));
       };

       const branches = ["Computer Science", "Information Technology", "Electronics", "Mechanical", "Civil"];
       const categories = ["General", "OBC", "SC", "ST"];
       const cutoffs = [];

       branches.forEach(branch => {
           // Deterministic "has branch"
           if ((college.name.length + branch.length) % 3 !== 0) { 
               categories.forEach(cat => {
                   cutoffs.push({
                       exam: "JEE Main",
                       year: 2025,
                       branch: branch,
                       category: cat,
                       closingPercentile: generateCutoff(branch, cat, basePercentile)
                   });
               });
           }
       });

       return {
           _id: `json_${index}`, // Fake ID
           name: college.name,
           location: { city, state },
           nirfRank: college.rating ? parseInt(college.rating.split('/')[0]) * 20 : Math.floor(Math.random() * 200),
           type: college.ownership || 'Private',
           cutoff: cutoffs
       };
    });
  } catch (err) {
    console.error("Error loading JSON data:", err);
    return [];
  }
};

// Cache the data in memory
const cachedColleges = loadCollegesFromFile();

// @desc    Predict colleges based on JEE Main percentile
// @route   POST /api/predictor/jee-main
// @access  Public
exports.predictColleges = async (req, res) => {
  try {
    const { percentile, category, homeState, gender, isPwd } = req.body;

    if (!percentile) {
        return res.status(400).json({ success: false, message: 'Please provide percentile' });
    }

    const rawUserPercentile = parseFloat(percentile);
    const userCategory = category || 'General';

    console.log(`Prediction Req: ${rawUserPercentile}% | ${userCategory} | ${homeState} | ${gender} | PWD:${isPwd}`);

    // Logic: Find colleges where the closing percentile is <= user's percentile
    const results = cachedColleges.reduce((acc, college) => {
       // specific bonus for this college
       let effectiveUserPercentile = rawUserPercentile;

       // Home State Quota Simulation
       if (homeState && college.location.state && 
           college.location.state.toLowerCase().includes(homeState.toLowerCase())) {
           effectiveUserPercentile += 2.0; // Bonus for HS
       }

       // Gender Simulation (Female Supernumerary)
       if (gender === 'Female') {
           effectiveUserPercentile += 1.0;
       }

       // PWD Simulation
       if (isPwd === 'Yes') {
           effectiveUserPercentile += 15.0; // Huge bonus for PWD
       }
       
       // Ensure max 100
       effectiveUserPercentile = Math.min(100, effectiveUserPercentile);

       const qualifyingBranches = college.cutoff.filter(c => 
          c.exam === 'JEE Main' && 
          c.category === userCategory && 
          c.closingPercentile <= effectiveUserPercentile
       );

       if (qualifyingBranches.length > 0) {
           acc.push({
             _id: college._id,
             name: college.name,
             location: college.location,
             nirfRank: college.nirfRank,
             type: college.type,
             branches: qualifyingBranches.map(b => ({
                name: b.branch,
                closingPercentile: b.closingPercentile,
                chance: (effectiveUserPercentile - b.closingPercentile) > 5 ? "High" : "Medium"
             }))
           });
       }
       return acc;
    }, []);

    // Pagination/Limit to avoid huge payload
    const limitedResults = results.slice(0, 50);

    res.status(200).json({
       success: true,
       count: limitedResults.length,
       data: limitedResults
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Seed dummy data for testing
// @route   POST /api/predictor/seed
// @access  Public
exports.seedColleges = async (req, res) => {
    // No-op since we are using file
    res.json({ message: "Using File-based data source. Seeding not required." });
};
