const express = require("express");
const path = require("path");

let app = express();
let port = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname,"public")));

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});