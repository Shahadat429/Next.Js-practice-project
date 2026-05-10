import mongoose, { connect } from "mongoose";


const dbURL = process.env.MONGODB_URI;

if (!dbURL) {
    throw new Error("MONGODB_URI is not defined in the environment variables.");
}

let cashed = global.mongoose;

if (!cashed) {
    cashed = global.mongoose = { connection: null, promise: null };
}

const connectDB = async () => {
    if (cashed.connection) {
        console.log("Using cached database connection.");
        return cashed.connection;
    }

    if (!cashed.promise) {
        cashed.promise = connect(`${dbURL}/practice_project_2`).then((c) => c.connection);
    }

    try {
        cashed.connection = await cashed.promise;
        console.log("Connected to the database successfully.");
    } catch (error) {
        throw error;
    }
    return cashed.connection;
};

export default connectDB;