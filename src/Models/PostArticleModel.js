const mongoose = require("mongoose");

const PostArticleSchema = new mongoose.Schema({

    userId: { type: String, require: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    sub_heading: { type: String, required: true },
    short_details: { type: String, required: true },
    body: { type: String, require: true },
    image: { type: String, require: true },
    url: { type: String, require: true },
    tags: { type: String, require: true },
    news_priority: { type: String, require: true },
    news_sections: { type: String, require: true },
    change_byline: { type: String, require: true },
    source: { type: String, require: true },
    isApproved: { type: Boolean, default: false },
    isRejected: { type: Boolean, default: false },
    schedule_time: { type: String, require: true },
    schedule_date: { type: String, require: true },

}, { timestamps: true });

module.exports = mongoose.model("PostArticle", PostArticleSchema)