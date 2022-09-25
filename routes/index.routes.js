import express from "express";
const routes = express();

// Define user Routes
import  {createUser, userList, filterData, multiSearch} from "../controller/user.js";

routes.post("/create", createUser);
routes.get("/userList", userList);
routes.get("/search", filterData);
routes.get("/multisearch", multiSearch);

export default routes;