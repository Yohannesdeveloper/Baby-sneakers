import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://yohannesfikreeshete_db_user:0991313700@cluster0.o5rtqrg.mongodb.net/babysneakers?retryWrites=true&w=majority";

async function testMongo() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Successfully connected to MongoDB");
        process.exit(0);
    } catch (e) {
        console.error("MongoDB Connection Failed:", e.message);
        process.exit(1);
    }
}
testMongo();
