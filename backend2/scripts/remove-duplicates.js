const mongoose = require('mongoose');
const MONGO_URI = "mongodb+srv://collegedost:collegedost_db@bhumit.4jfsdnd.mongodb.net/?appName=bhumit";

async function removeDuplicates() {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.db;
        const examsCollection = db.collection('exams');

        // Find duplicates by examSlug
        const duplicates = await examsCollection.aggregate([
            {
                $group: {
                    _id: "$examSlug",
                    count: { $sum: 1 },
                    ids: { $push: "$_id" }
                }
            },
            {
                $match: {
                    count: { $gt: 1 }
                }
            }
        ]).toArray();

        console.log(`Found ${duplicates.length} duplicate slugs.`);

        let totalDeleted = 0;
        for (const duplicate of duplicates) {
            // Keep the first ID, delete the others
            const [keepId, ...deleteIds] = duplicate.ids;

            const result = await examsCollection.deleteMany({
                _id: { $in: deleteIds }
            });

            console.log(`For slug "${duplicate._id}": kept ${keepId}, deleted ${result.deletedCount} duplicates.`);
            totalDeleted += result.deletedCount;
        }

        console.log(`\nCleanup complete. Total records deleted: ${totalDeleted}`);

        // Try to create unique index on examSlug if it doesn't exist
        try {
            await examsCollection.createIndex({ examSlug: 1 }, { unique: true });
            console.log("Unique index on examSlug verified/created successfully.");
        } catch (indexError) {
            console.error("Error creating unique index:", indexError.message);
        }

        process.exit(0);
    } catch (err) {
        console.error("Critical error:", err);
        process.exit(1);
    }
}

removeDuplicates();
