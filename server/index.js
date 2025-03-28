const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const db = require("./db/db.js");
const { createTables } = require("./db/schema.js");

const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/", (req,res,next)=>{
    res.send("hello from server");
})

const init = async ()=>{
    try {
        await createTables();
        console.log("Database tables initialized");

        app.listen(PORT, () => {
            console.log(`server alive on port ${PORT}`);
        });
    } catch(err) {
        console.log("Error during initialization:", err);
    }
};

    init();