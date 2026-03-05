const mongoose = require('mongoose');
const MONGO_URI = "mongodb+srv://collegedost:collegedost_db@bhumit.4jfsdnd.mongodb.net/?appName=bhumit";

async function findDuplicates() {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.db;

        const duplicates = await db.collection('exams').aggregate([
            {
                $group: {
                    _id: "$examName",
                    count: { $sum: 1 },
                    ids: { $push: "$_id" },
                    slugs: { $push: "$examSlug" }
                }
            },
            {
                $match: {
                    count: { $gt: 1 }
                }
            }
        ]).toArray();

        console.log(JSON.stringify(duplicates, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

findDuplicates();
