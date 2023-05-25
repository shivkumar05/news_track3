const mongoose = require("mongoose");

const PostNewsGetSchema = new mongoose.Schema({

    category: { type: String, require: true },
    title: { type: String, require: true },
    sub_heading: { type: String, require: true },
    short_details: { type: String, require: true },
    body: { type: String, require: true },
    image: { type: String, require: true },
    url: { type: String, require: true },
    tags: { type: String, require: true },
    news_priority: { type: String, require: true },
    news_sections: { type: String, require: true },
    change_byline: { type: String, require: true },
    source: { type: String, require: true },

}, { timestamps: true });

module.exports = mongoose.model("PostNews", PostNewsGetSchema)