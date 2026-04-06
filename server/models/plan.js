const mongoose = require("mongoose")

const PlanSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    accessCode: {
        type: String,
        default: null
    },
    userId: {
        type:String
    },
}, {
    versionKey: false,
    timestamps: true
})

module.exports = mongoose.model('Plan', PlanSchema)