const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = require("./src/Routes/route");
const Middleware = require("./src/Middleware/auth");
const UserRoleModel = require("./src/Models/User_RoleModel");
const PostArticleModel = require("./src/Models/PostArticleModel");
const PublicationDetailsModel = require("./src/Models/PublicationDetailsModel");
const UserModel = require("./src/Models/UserModel");
const port = process.env.PORT || 4000;

app.use(cors());

app.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

mongoose.set("strictQuery", false);

//===================== [ Multer Storage ] =================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationDir = "./uploads";
    fs.mkdirSync(destinationDir, { recursive: true });
    cb(null, destinationDir);
  },
  filename: function (req, file, cb) {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5000000,
  },
});

//======================[Create Post news]==================================

app.post(
  "/:userId/post-news",
  Middleware.jwtValidation,
  Middleware.authorization,
  upload.single("image"),
  async (req, res) => {
    try {
      let data = req.body;
      let userId = req.params.userId;
      let file = req.file;
      let {
        category,
        title,
        sub_heading,
        short_details,
        body,
        image,
        url,
        tags,
        news_priority,
        news_sections,
        change_byline,
        source,
        isApproved,
        schedule_time,
        schedule_date
      } = data;

      data.userId = userId;
      if (file) {
        data.image = `/image/${file.filename}`;
      }
      let PostArticle = await PostArticleModel.create(data);
      res.status(201).send({
        status: true,
        message: "Post News Created Successfully",
        data: PostArticle,
      });
    } catch (err) {
      res.status(500).send({ status: false, error: err.message });
    }
  }
);

//====================== [Create User Role] ==================================

app.post("/user-role", upload.single("user_image"), async (req, res) => {
  try {
    let data = req.body;
    let file = req.file;
    let {
      user_name,
      first_name,
      middle_name,
      last_name,
      department,
      user_role,
      user_superior,
      byline,
      display_name,
      password,
      pin_code,
      address,
      state,
      city,
      mobile_1,
      mobile_2,
      email_1,
      email_2,
      user_image,
      user_BIO,
      social_facebook,
      social_twitter,
      social_linkedin,
      social_instagram,
    } = data;

    if (await UserRoleModel.findOne({ mobile_1: mobile_1 }))
      return res
        .status(400)
        .send({ status: false, message: "Mobile_1 already exist" });

    if (await UserRoleModel.findOne({ email_1: email_1 }))
      return res
        .status(400)
        .send({ status: false, message: "Email_1 already exist" });

    if (await UserRoleModel.findOne({ mobile_2: mobile_2 }))
      return res
        .status(400)
        .send({ status: false, message: "Mobile_2 already exist" });

    if (await UserRoleModel.findOne({ email_2: email_2 }))
      return res
        .status(400)
        .send({ status: false, message: "Email_2 already exist" });

    const encryptedPassword = bcrypt.hashSync(password, 12);
    req.body["password"] = encryptedPassword;

    var token = jwt.sign(
      {
        userId: UserRoleModel._id,
      },
      "project"
    );
    data.token = token;
    if (file) {
      data.user_image = `/image/${file.filename}`;
    }

    let savedData = await UserRoleModel.create(data);
    res.status(201).send({
      status: true,
      msg: "User Role Model Register successfull",
      data: {
        user_name: savedData.user_name,
        password: savedData.password,
        first_name: savedData.first_name,
        middle_name: savedData.middle_name,
        last_name: savedData.last_name,
        department: savedData.department,
        user_role: savedData.user_role,
        user_superior: savedData.user_superior,
        byline: savedData.byline,
        display_name: savedData.display_name,
        pin_code: savedData.pin_code,
        address: savedData.address,
        state: savedData.state,
        city: savedData.city,
        mobile_1: savedData.mobile_1,
        mobile_2: savedData.mobile_2,
        email_1: savedData.email_1,
        email_2: savedData.email_2,
        user_image: savedData.user_image,
        user_BIO: savedData.user_BIO,
        social_facebook: savedData.social_facebook,
        social_twitter: savedData.social_twitter,
        social_linkedin: savedData.social_linkedin,
        social_instagram: savedData.social_instagram,
        token: savedData.token,
      },
    });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
});

//======================= [Create Publication Details] =========

app.post(
  "/publication-details",
  upload.fields([
    { name: "logo_large", maxCount: 5 },
    { name: "logo_small", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      let data = req.body;
      let file = req.files;
      let {
        publisher_name,
        type_of_Entity,
        mobile,
        email,
        password,
        owner_key,
        publisher_BIO,
        account_manager,
        status_user,
        status_publication,
        Revenue_Share,
        Agreement_Start_Date,
        Agreement_End_Date,
        Auto_Renewal,
        Refferal_by,
        PAN_No,
        GST_No,
        Bank_acc_No,
        Bank_name,
        Branch_name,
        IFSC_code,
        pub_social_facebook,
        pub_social_twitter,
        pub_social_linkedin,
        pub_social_instagram,
        pub_social_youtube,
        domain_name,
        logo_large,
        logo_small,
        site_display_contact,
        publisher_site_mobile,
        publisher_site_email,
        regd_address,
        regd_state_city,
        regd_pin_code,
        comm_address,
        comm_state_city,
        comm_pin_code,
        tech_name,
        tech_mobile,
        tech_email,
        finance_name,
        finance_mobile,
        finance_email,
        sales_name,
        sales_mobile,
        sales_email,
        editorial_name,
        editorial_mobile,
        editorial_email,
        publication_name,
        Lang_of_Publication,
        city_of_publication,
        frequency_of_publication,
        circulation,
        RNI_No,
        RNI_Regn_date,
      } = data;

      if (await PublicationDetailsModel.findOne({ email: email }))
        return res
          .status(400)
          .send({ status: false, message: "Email already exist" });

      const encryptedPassword = bcrypt.hashSync(password, 12);
      req.body["password"] = encryptedPassword;

      var token = jwt.sign(
        {
          userId: PublicationDetailsModel._id,
        },
        "project"
      );
      data.token = token;

      if (file) {
        (data.logo_large = `/image/${file.logo_large[0].filename}`),
          (data.logo_small = `/image/${file.logo_small[0].filename}`);
      }
      let PublicationDetails = await PublicationDetailsModel.create(data);
      res.status(201).send({
        status: true,
        message: " Publication Details Created Successfully",
        data: PublicationDetails,
      });
    } catch (err) {
      res.status(500).send({ status: false, error: err.message });
    }
  }
);

//******************* [Approve and Update] ************ */

app.put("/:userId/ApprovalupdateNews", Middleware.jwtValidation, Middleware.authorization, async (req, res) => {
  try {
    let postNewsId = req.body._id;
    const { schedule_time, schedule_date } = req.body;

    try {
      let news = await PostArticleModel.findById(postNewsId);

      if (!news) {
        return res.status(404).json({ error: 'News not found' });
      }

      if (!news.isApproved) {
        news.schedule_time = schedule_time;
        news.schedule_date = schedule_date;
        news.isApproved = true;
      }
      const updatedNews = await news.save();

      return res.status(200).json({
        status: true,
        message: 'Post updated successfully',
        isApproved: updatedNews.isApproved
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }


  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
})

app.get("/:userId/getApproval", Middleware.jwtValidation, Middleware.authorization, async (req, res) => {
  try {
    const data = req.body;
    const userId = req.params.userId;

    const response = await PostArticleModel.find().lean();

    if (response.length > 0) {
      const approvedPosts = response.filter((post) => post.isApproved && !post.isRejected);

      if (approvedPosts.length > 0) {
        for (let i = 0; i < approvedPosts.length; i++) {
          const postUserId = approvedPosts[i].userId;

          let user = await UserModel.findById({ _id: postUserId }).lean();
          if (user) {
            approvedPosts[i].username = user.name;
          } else {
            let publication = await PublicationDetailsModel.findById({ _id: postUserId }).lean();
            if (publication) {
              approvedPosts[i].username = publication.publisher_name;
            }
          }
        }

        res.status(200).send({
          status: true,
          message: "Get Post News Successfully",
          data: approvedPosts,
        });
      } else {
        res.status(200).send({
          status: true,
          message: "No approved post news found for the user.",
          data: [],
        });
      }
    } else {
      res.status(200).send({
        status: true,
        message: "No post news found for the user.",
        data: [],
      });
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "An error occurred while retrieving post news.",
      error: error.message,
    });
  }
});

//**********************[ Reject And Update ]*************** */
app.put("/:userId/RejectUpdateNews", Middleware.jwtValidation, Middleware.authorization, async (req, res) => {
  try {
    let postNewsId = req.body._id;
    let News = await PostArticleModel.findById({ _id: postNewsId });

    if (News.isRejected == false) {
      var updateNews = await PostArticleModel.findByIdAndUpdate(
        { _id: postNewsId },
        { $set: { isRejected: true } },
        { new: true }
      );
    }
    // if (News.isRejected == true) {
    //   var updateNews = await PostArticleModel.findByIdAndUpdate(
    //     { _id: postNewsId },
    //     { $set: { isRejected: false } },
    //     { new: true }
    //   );
    // }
    return res.status(200).send({
      status: true,
      message: "Post Update Successfully",
      isRejected: updateNews.isRejected
    })

  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
})

app.get("/:userId/getRejected", Middleware.jwtValidation, Middleware.authorization, async (req, res) => {
  try {
    const data = req.body;
    const userId = req.params.userId;

    // Retrieve all posts
    const response = await PostArticleModel.find().lean();

    if (response.length > 0) {
      const rejectedPosts = response.filter((post) => post.isRejected && !post.isApproved);

      if (rejectedPosts.length > 0) {
        // Add username to each post
        for (let i = 0; i < rejectedPosts.length; i++) {
          const postUserId = rejectedPosts[i].userId;
          // console.log(postUserId);

          // Retrieve UserModel by ID
          let user = await UserModel.findById({ _id: postUserId }).lean();
          if (user) {
            rejectedPosts[i].username = user.name;
          } else {
            let publication = await PublicationDetailsModel.findById({ _id: postUserId }).lean();
            if (publication) {
              rejectedPosts[i].username = publication.publisher_name;
              console.log(publication.publisher_name);
            }
          }
        }

        res.status(200).send({
          status: true,
          message: "Get Post News Successfully",
          data: rejectedPosts,
        });
      } else {
        res.status(200).send({
          status: true,
          message: "No rejected post news found for the user.",
          data: [],
        });
      }
    } else {
      res.status(200).send({
        status: true,
        message: "No post news found for the user.",
        data: [],
      });
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "An error occurred while retrieving post news.",
      error: error.message,
    });
  }
});


//************************ [Database Connection] ************ */
mongoose
  .connect(
    "mongodb+srv://Newspaper:Li6BnjEH2cYgkQNc@cluster0.j5zzyto.mongodb.net/"
  )
  .then(() => console.log("Database is connected successfully.."))
  .catch((Err) => console.log(Err));

app.use("/", router);

app.listen(port, function () {
  console.log(`Server is connected on Port ${port} ✅✅✅`);
});

// Li6BnjEH2cYgkQNc
//mongodb+srv://Newspaper:Li6BnjEH2cYgkQNc@cluster0.j5zzyto.mongodb.net/
