const express = require("express");
const Router = express.Router();
const bodyParser = require("body-parser");
const Controller = require("../Controllers/user");
const Middleware = require("../Middleware/auth")

Router.post("/createUser", Controller.createUser);
Router.post("/adminLogin", Controller.userLogin);
Router.post("/createPlateform", Controller.CreatePlateform)
Router.post("/createCategories", Controller.CreateCategories)
Router.post("/createSubCategories", Controller.CreateSubCategories)
Router.post("/language", Controller.UserLanguage)
Router.post("/article", Controller.CreateArticle)
Router.post("/mediaType", Controller.createMediaModel)
Router.get("/get-states", Controller.getState)
Router.post("/check-box", Controller.CheckBox)
Router.post("/select", Controller.SelectCategories)
Router.post("/user-role", Controller.UserRole)
Router.post("/status", Controller.StatusModel)
Router.get("/:id/postGet", Controller.getPostNews)
Router.put("/:id/postUpdate", Controller.updatePostNews);
Router.post("/newsPaperAgencyLogin", Controller.NewsPaperAgencyLogin)



Router.use(bodyParser.json());
Router.use(bodyParser.urlencoded({ extended: true }));


//===================== checking your end point valid or not =======================//

Router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        message: "Make Sure Your Endpoint is Correct or Not!"
    })
});

module.exports = Router;
