const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({

    plateform: { type: Number },
    categories: { type: Number },
    sub_categories: { type: Number },
    language: { type: Number },
    image: { type: String },
    date: { type: String },
    expiry_date: { type: String },
    agencies: { type: String },
    heading: { type: String },
    meta_keywords: { type: String },
    sub_heading: { type: String },
    short_details: { type: String },
    description: { type: String },
    priority: { type: Number },
    details: { type: String },
    share_links: { type: String },
    tag_news: { type: String },

}, { timestamps: true });

module.exports = mongoose.model("Article", ArticleSchema)



