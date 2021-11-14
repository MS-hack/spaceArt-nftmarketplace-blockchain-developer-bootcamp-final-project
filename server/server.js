const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
//app.use(require("./routes/record"));
// get driver connection
const dbo = require("./db");

app.listen(port, () => {
  // perform a database connection when server starts
 dbo.connectToServer(function (err) {
   if (err) console.error(err);
 
 });
 console.log(`Server is running on port: ${port}`);
});


//mongoose.connect(connection_string, {
 //   useNewUrlParser: true,
//    useUnifiedTopology: true
//})
//.then( () => console.log("Mongo connected"))
//.catch((error) => console.error("connection failed:", error.message))