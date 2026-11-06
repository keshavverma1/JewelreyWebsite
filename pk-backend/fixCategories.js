
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function fixCategories() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const collection =
      mongoose.connection.collection("categories");

    const result = await collection.updateMany(
      { "parentId.$oid": { $exists: true } },
      [
        {
          $set: {
            parentId: {
              $toObjectId: "$parentId.$oid",
            },
          },
        },
      ]
    );

    console.log("Updated:", result.modifiedCount);
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
}

fixCategories();
