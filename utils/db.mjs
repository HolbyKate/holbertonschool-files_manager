/* eslint-disable */
import pkg from "mongodb";
const { MongoClient } = pkg;

class DBClient {
    constructor() {
        const host = process.env.DB_HOST || "localhost";
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || "files_manager";

        const uri = `mongodb://${host}:${port}/${database}`;
        this.client = new MongoClient(uri, { useUnifiedTopology: true });
        this.db = null;

        this.client
            .connect()
            .then(() => {
                this.db = this.client.db(database);
                console.log("Connected successfully to MongoDB");
            })
            .catch((err) => {
                console.error("Failed to connect to MongoDB:", err);
            });
    }

    isAlive() {
        return !!this.client && !!this.db;
    }

    async nbUsers() {
        if (!this.db) return 0;
        return this.db.collection("users").countDocuments();
    }

    async nbFiles() {
        if (!this.db) return 0;
        return this.db.collection("files").countDocuments();
    }
}

const dbClient = new DBClient();
export default dbClient;
