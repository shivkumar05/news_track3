const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CreateModel = require("../Models/UserModel");
const PlateformModel = require("../Models/PlateformModel");
const CategoriesModel = require("../Models/CategoriesModel");
const SubCategoriesModel = require("../Models/SubCategoriesModel");
const LanguageModel = require("../Models/LanguageModel");
const ArticleModel = require("../Models/ArticleModel");
const MediaModel = require("../Models/MediaModel");
const StateModel = require("../Models/StateModel");
const CheckBoxModel = require("../Models/CheckBoxModel");
const SelectModel = require("../Models/SelectModel");
const UserRoleModel = require("../Models/User_RoleModel");
const StatusModels = require("../Models/StatusModel");
const PublicationDetailsModel = require("../Models/PublicationDetailsModel");
const PostNewsModel = require("../Models/PostArticleModel");

//*************** [Create User] *************************/

const createUser = async function (req, res) {
  try {
    let data = req.body;
    let { name, phone, email, password, address } = data;

    if (await CreateModel.findOne({ phone: phone }))
      return res
        .status(400)
        .send({ status: false, message: "Phone already exist" });

    if (await CreateModel.findOne({ email: email }))
      return res
        .status(400)
        .send({ status: false, message: "Email already exist" });

    const encryptedPassword = bcrypt.hashSync(password, 12);
    req.body["password"] = encryptedPassword;

    var token = jwt.sign(
      {
        userId: CreateModel._id,
      },
      "project"
    );
    data.token = token;

    let savedData = await CreateModel.create(data);
    res.status(201).send({
      status: true,
      msg: "User Register successfull",
      data: {
        name: savedData.name,
        phone: savedData.phone,
        email: savedData.email,
        password: savedData.password,
        address: savedData.address,
      },
    });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

//**************** [User Login] ******************/

const userLogin = async function (req, res) {
  try {
    let data = req.body;
    let { email, password } = data;

    let userExists = await CreateModel.findOne({ email: email });

    if (!userExists) {
      return res.status(400).send({
        status: false,
        msg: "Email and Password is Invalid",
      });
    }

    let compared = await bcrypt.compare(password, userExists.password);
    if (!compared) {
      return res.status(400).send({
        status: false,
        message: "Your password is invalid",
      });
    }
    var token = jwt.sign(
      {
        userId: userExists._id,
      },
      "project"
    );

    let updateToken = await CreateModel.findByIdAndUpdate(
      { _id: userExists._id },
      { token },
      { new: true }
    );
    userExists.token = updateToken.token;

    return res.status(200).send({
      status: true,
      msg: "Super Admin Login successfully",
      data: userExists,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      msg: error.message,
    });
  }
};

//*****************[News Paper Agency Login]********/

const NewsPaperAgencyLogin = async function (req, res) {
  try {
    let data = req.body;
    let { email, password } = data;

    let userExists = await PublicationDetailsModel.findOne({ email: email });

    if (!userExists) {
      return res.status(400).send({
        status: false,
        msg: "Email and Password is Invalid",
      });
    }

    // let compared = await bcrypt.compare(password, userExists.password);
    // if (!compared) {
    //   return res.status(400).send({
    //     status: false,
    //     message: "Your password is invalid",
    //   });
    // }

    var token = jwt.sign(
      {
        userId: userExists._id,
      },
      "project"
    );

    let updateToken = await PublicationDetailsModel.findByIdAndUpdate(
      { _id: userExists._id },
      { token },
      { new: true }
    );
    userExists.token = updateToken.token;

    return res.status(200).send({
      status: true,
      msg: "News Paper Agency Login successfully",
      data: userExists,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      msg: error.message,
    });
  }
};

//**************** [Create Plateform]**************** */

const CreatePlateform = async function (req, res) {
  try {
    let data = req.body;
    let { id, plateform_name } = data;

    let plateform = await PlateformModel.create(data);
    res.status(201).send({
      status: true,
      message: "Plateform Created Successfully",
      data: plateform,
    });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

//************** [Create Categories] ******************/

const CreateCategories = async function (req, res) {
  try {
    let data = req.body;
    let { id, categories_name } = data;

    let categories = await CategoriesModel.create(data);
    res.status(201).send({
      status: true,
      message: "Categories Created Successfully",
      data: categories,
    });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

//************* [Create SubCategories] ****************/

const CreateSubCategories = async function (req, res) {
  try {
    let data = req.body;
    let { id, subcategories_name } = data;

    let subcategories = await SubCategoriesModel.create(data);
    res.status(201).send({
      status: true,
      message: "SubCategories Created Successfully",
      data: subcategories,
    });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

//*************** [User Language] **************/

const UserLanguage = async function (req, res) {
  try {
    let data = req.body;
    let { id, language_name } = data;

    let Language = await LanguageModel.create(data);
    res.status(201).send({
      status: true,
      message: "Language Selected Successfully",
      data: Language,
    });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

//******************* [Create Article] ************************/

const CreateArticle = async function (req, res) {
  try {
    let data = req.body;
    let {
      plateform,
      categories,
      sub_categories,
      language,
      take_images,
      date,
      expiry_date,
      agencies,
      heading,
      meta_keywords,
      sub_heading,
      short_details,
      description,
    } = data;

    let Article = await ArticleModel.create(data);
    res.status(201).send({
      status: true,
      message: "Article Created Successfully",
      data: Article,
    });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

//**************** [Media type] **********************/

const createMediaModel = async function (req, res) {
  try {
    let data = req.body;
    let { id, media_type } = data;

    let Media = await MediaModel.create(data);
    res.status(201).send({
      status: true,
      message: "Media type Created Successfully",
      data: Media,
    });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

//************** [Check Box] ***************/

const CheckBox = async function (req, res) {
  try {
    let data = req.body;
    let { id, checkbox_name } = data;

    let Check_Box = await CheckBoxModel.create(data);
    res.status(201).send({
      status: true,
      message: "CheckBox Model Created Successfully",
      data: Check_Box,
    });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

//******************* [Select Model] *************** */

const SelectCategories = async function (req, res) {
  try {
    let data = req.body;
    let { id, select_name } = data;

    let Check_Box = await SelectModel.create(data);
    res.status(201).send({
      status: true,
      message: "SelectCategories Created Successfully",

      data: Check_Box,
    });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

//****************** [State And Cities] ******************/

const getState = async (req, res) => {
  try {
    const city = await StateModel.find({});
    res
      .status(200)
      .send({ success: true, msg: "State and City data", data: city });
  } catch (error) {
    res.status(500).send({ success: false, msg: error.message });
  }
};

//**************** [Status Model] ********************** */

const StatusModel = async function (req, res) {
  try {
    let data = req.body;
    let { user_status } = data;

    let Status = await StatusModels.create(data);
    res.status(201).send({
      status: true,
      message: " Status Model Created Successfully",
      data: Status,
    });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

//******************** Get Post Article Model ************************** */

const getPostNews = async (req, res) => {
  try {
    let data = req.body;
    let userId = req.params.userId;

    const getdata = await PostNewsModel.find({ userId: userId }, data);

    res
      .status(200)
      .send({ success: true, msg: "Post News Get Success", data: getdata });
  } catch (error) {
    res.status(500).send({ success: false, msg: error.message });
  }
};

//==========================[Update Post News]======================//

const updatePostNews = async (req, res) => {
  try {
    let data = req.body;
    let userId = req.params.userId;

    const updatedPost = await PostNewsModel.find({ userId: userId }, data, {
      new: true,
    });

    if (!updatedPost) {
      return res.status(404).send({ success: false, msg: "Post not found" });
    }

    res.status(200).send({
      success: true,
      msg: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    res.status(500).send({ success: false, msg: error.message });
  }
};

//===============[Get Approval]=======================
const getApproval = async (req, res) => {
  try {
    let data = req.body;
    const userId = req.params.userId;

    const response = await PostArticleModel.find({ userId: userId });
    console.log(response, "aaa");

    res.status(200).send({
      status: true,
      message: " Get Post News Successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).send({ success: false, msg: error.message });
  }
};

module.exports = {
  createUser,
  userLogin,
  NewsPaperAgencyLogin,
  getPostNews,
  updatePostNews,
  CreatePlateform,
  CreateCategories,
  CreateSubCategories,
  UserLanguage,
  CreateArticle,
  createMediaModel,
  CheckBox,
  SelectCategories,
  getState,
  StatusModel,
};
