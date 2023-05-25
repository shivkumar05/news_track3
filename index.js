const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const cors = require('cors');
const bcrypt = require("bcrypt");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = require("./src/Routes/route");
const Middleware = require("./src/Middleware/auth")
const UserRoleModel = require("./src/Models/User_RoleModel");
const PostArticleModel = require("./src/Models/PostArticleModel");
const PublicationDetailsModel = require("./src/Models/PublicationDetailsModel");
const port = process.env.PORT || 3000

app.use(cors())

app.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('strictQuery', false);

//=====================[Multer Storage]=================================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationDir = './uploads';
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

app.post("/:userId/post-news", Middleware.jwtValidation, Middleware.authorization, upload.single('image'), async (req, res) => {
    try {
        let data = req.body;
        let file = req.file;
        let { category, title, sub_heading, short_details, body, image, url, tags, news_priority, news_sections, change_byline, source } = data;

        if (file) {
            data.image = `/image/${file.filename}`
        }
        let PostArticle = await PostArticleModel.create(data)
        res.status(201).send({
            status: true,
            message: "PostArticle Created Successfully",
            data: PostArticle
        })
    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
});

//======================[Create User Role]==================================

app.post("/user-role", upload.single('user_image'), async (req, res) => {
    try {
        let data = req.body;
        let file = req.file;
        let { user_name, first_name, middle_name, last_name, department, user_role, user_superior, byline, display_name, password, pin_code, address, state, city, mobile_1, mobile_2, email_1, email_2, user_image, user_BIO, social_facebook, social_twitter, social_linkedin, social_instagram } = data

        if (await UserRoleModel.findOne({ mobile_1: mobile_1 }))
            return res.status(400).send({ status: false, message: "Mobile_1 already exist" })

        if (await UserRoleModel.findOne({ email_1: email_1 }))
            return res.status(400).send({ status: false, message: "Email_1 already exist" })

        if (await UserRoleModel.findOne({ mobile_2: mobile_2 }))
            return res.status(400).send({ status: false, message: "Mobile_2 already exist" })

        if (await UserRoleModel.findOne({ email_2: email_2 }))
            return res.status(400).send({ status: false, message: "Email_2 already exist" })

        const encryptedPassword = bcrypt.hashSync(password, 12)
        req.body['password'] = encryptedPassword;

        var token = jwt.sign({
            userId: UserRoleModel._id,
        }, "project");
        data.token = token;
        if (file) {
            data.user_image = `/image/${file.filename}`
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
                token: savedData.token
            }
        })
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
});

//=======================[Create Publication Details]=========
app.post("/publication-details", upload.fields([
    { name: "logo_large", maxCount: 5 },
    { name: "logo_small", maxCount: 5 },
]), async (req, res) => {
    try {
        let data = req.body;
        let file = req.files;
        let { publisher_name, type_of_Entity, password, owner_key, publisher_BIO, account_manager, status_user, status_publication, Revenue_Share, Agreement_Start_Date, Agreement_End_Date, Auto_Renewal, Refferal_by, PAN_No, GST_No, Bank_acc_No, Bank_name, Branch_name, IFSC_code, pub_social_facebook, pub_social_twitter, pub_social_linkedin, pub_social_instagram, pub_social_youtube, domain_name, logo_large, logo_small, site_display_contact, publisher_site_mobile, publisher_site_email, mobile, email, regd_address, regd_state_city, regd_pin_code, comm_address, comm_state_city, comm_pin_code, tech_name, tech_mobile, tech_email, finance_name, finance_mobile, finance_email, sales_name, sales_mobile, sales_email, editorial_name, editorial_mobile, editorial_email, publication_name, Lang_of_Publication, city_of_publication, frequency_of_publication, circulation, RNI_No, RNI_Regn_date } = data;

        if (file) {
            data.logo_large = `/image/${file.logo_large[0].filename}`,
            data.logo_small = `/image/${file.logo_small[0].filename}`
        }
        let PublicationDetails = await PublicationDetailsModel.create(data)
        res.status(201).send({
            status: true,
            message: " Publication Details Created Successfully",
            data: PublicationDetails
        })
    } catch (err) {
        res.status(500).send({ status: false, error: err.message });
    }
})



// app.post("/createArticle", upload.single("image"), async (req, res) => {
//     try {
//         let data = req.body;
//         let file = req.file;
//         console.log(file);
//         let {
//             plateform,
//             categories,
//             sub_categories,
//             language,
//             image,
//             date,
//             expiry_date,
//             agencies,
//             heading,
//             meta_keywords,
//             sub_heading,
//             short_details,
//             description,
//         } = data;

//         if (file) {
//             data.image = `/image/${file.filename}`;
//         }
//         let Article = await ArticleModel.create(data);
//         res.status(201).send({
//             status: true,
//             message: "Article Created Successfully",
//             data: Article,
//         });
//     } catch (err) {
//         res.status(500).send({ status: false, error: err.message });
//     }
// });


//************************Database Connection************ */
mongoose.connect("mongodb+srv://Newspaper:Li6BnjEH2cYgkQNc@cluster0.j5zzyto.mongodb.net/")
    .then(() => console.log("Database is connected successfully.."))
    .catch((Err) => console.log(Err))

app.use("/", router)

app.listen(port, function () {
    console.log(`Server is connected on Port ${port} ✅✅✅`)
});

// Li6BnjEH2cYgkQNc
//mongodb+srv://Newspaper:Li6BnjEH2cYgkQNc@cluster0.j5zzyto.mongodb.net/


