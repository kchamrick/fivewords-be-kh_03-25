const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const {client} = require("./db.js");

const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/", (req,res,next)=>{
    res.send("hello from server");
})

const init = async ()=>{
    try{
    await client.connect();
    app.listen(PORT, ()=>{
        console.log(`server alive on port ${PORT}`)
    });
    }catch(err){
            console.log(err)
        }
    };

    init();