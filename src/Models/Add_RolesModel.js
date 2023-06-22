const mongoose = require("mongoose");

const AddRolesModelSchema = new mongoose.Schema({
    
    userId: {type: String, require: true},
    role_name: { type: String, required: true },
    status: { type: String, required: true },
    department: { type: [Boolean], default: [false, false, false] },
    designation: { type: [Boolean], default: [false, false, false] },
    role: { type: [Boolean], default: [false, false, false] },
    main_menu: { type: [Boolean], default: [false, false, false] },
    subMenu_level_1: { type: [Boolean], default: [false, false, false] },
    subMenu_level_2: { type: [Boolean], default: [false, false, false] },
    create_user: { type: [Boolean], default: [false, false, false] },
    user_role_custom: { type: [Boolean], default: [false, false, false] },
    post_news: { type: [Boolean], default: [false, false, false] },
    create_project: { type: [Boolean], default: [false, false, false] },
    create_job_task: { type: [Boolean], default: [false, false, false] },
    assign_task: { type: [Boolean], default: [false, false, false] }

}, { timestamps: true });

module.exports = mongoose.model("Add_roles", AddRolesModelSchema);
