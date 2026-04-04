const mongoose = require("mongoose")

const PlanSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    startDate: {
        type: String,
        default: null
    },
    endDate: {
        type: String,
        default: null
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
    schedule: [{
        day: Number,
        destinations: []
    }]
}, {
    versionKey: false,
    timestamps: true
})

module.exports = mongoose.model('Plan', PlanSchema)