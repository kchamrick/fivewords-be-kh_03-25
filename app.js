require("dotenv").config({ path: "/.env" });
const { client } = require("./server/db/index.js");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

// Middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Use the API routes defined in the index.js file
app.use("/api", require("./server/api"));

if (
    !process.env.PGUSER ||
    !process.env.PGHOST ||
    !process.env.PGDATABASE ||
    !process.env.PGPASSWORD ||
    !process.env.PGPORT
) {
    console.error("One or more environment variables are missing.");
    process.exit(1);
}

const init = async () => {
    try {
        await client.connect();
        console.log("connected to database");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("connection error:", error);
    }
};

init();