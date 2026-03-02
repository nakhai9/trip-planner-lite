const mongoose = require("mongoose")

const PlanImageSchema = new mongoose.Schema({
    url: {
        type: String
    },
    userId: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('PlanImage', PlanImageSchema, "plan_image")