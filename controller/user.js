import UserModel from "../models/user.model.js";

// Create User
export const createUser = async (req, res) => {
    const { firstName, lastName, city} = req.body;
    try {
        const userDetails = new UserModel({firstName, lastName, city});
        const result = await userDetails.save();
        res.status(201).json({ message: "User Create", data:result})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Sorry, something went wrong" });
    }
};

// Get all User List 
export const userList = async (req, res) => {
    try {
        const pageNumber = parseInt(req.query.pageNumber) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const result = {};
        const totalPosts = await UserModel.countDocuments().exec();
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        result.totalPosts = totalPosts;
        if (startIndex > 0) {
          result.previous = {
            pageNumber: pageNumber - 1,
            limit: limit,
          };
        }
        if (endIndex < (await UserModel.countDocuments().exec())) {
          result.next = {
            pageNumber: pageNumber + 1,
            limit: limit,
          };
        }
        result.data = await UserModel.find()
          .sort({firstName:1, lastName:1, city:1})
          .skip(startIndex)
          .limit(limit)
          .exec();
        result.rowsPerPage = limit;
        return res.json({ msg: "Posts Fetched successfully", data: result });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Sorry, something went wrong" });
      }
};

//speicific field Search APi
export const filterData = async (req, res) => {
    try {
        const filter = req.query;
        let where = {};
        if (filter.city) {
            where.city = { $regex: filter.city, $options: "i" }
        }
        let query = UserModel.find(where);
        const page = parseInt(req.body.page) || 1;
        const pageSize = parseInt(req.body.limit) || 10;
        const skip = (page - 1) * pageSize;
        const total = await UserModel.countDocuments(where);
        const pages = Math.ceil(total / pageSize);

        if (page > pages) {
            return res.status(404).json({
                status: "fail",
                message: "No page found",
            });
        }
        let result = await query.skip(skip).limit(pageSize);
        res.json({
            status: "success",
            filter,
            count: result.length,
            page,
            pages,
            data: result
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: "error",
            message: "Server Error",
        });
    }
};

// Allow multi column search  API
export const multiSearch = async (req, res) => {
    try {
        const filters = req.query;
        const data = await UserModel.find().sort({firstName:1, lastName:1, city:1})
        const filteredUsers = data.filter(user => {
            let isValid = true;
            for (let key in filters) {
                console.log(key, user[key], filters[key]);
                isValid = isValid && user[key] == filters[key];
            }
            return isValid;
        });
        const page = parseInt(req.body.page) || 1;
        const pageSize = parseInt(req.body.limit) || 10;
        const skip = (page - 1) * pageSize;
        const total = await UserModel.countDocuments();
        const pages = Math.ceil(total / pageSize);
        res.json({
            status: "success",
            filters,
            count: filteredUsers.length,
            page,
            pages,
            data: filteredUsers
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "Server Error",
        });
    }
};