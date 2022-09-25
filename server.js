import express from "express";
const app = express();
const PORT = 3000;

app.use(express.json());

// Require databasefile
import "./db/db.js";

//Define Routes index file
import routes from "./routes/index.routes.js"
app.use("/api", routes)
//Srever Listen
app.listen(PORT, () =>{
    console.log(`Server Running on PORT ${PORT}`);
});