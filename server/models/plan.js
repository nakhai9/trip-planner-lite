const mongoose = require("mongoose")

const PlanSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    startAt: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    destinations: {
        type: [
            {
                codeName: String,
                activities: [String],
                day: Number,
                name: String
            }
        ],
        default: []
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    password: {
        type: String,
        default: null
    },
}, {
    versionKey: false,
    timestamps: true
})

module.exports = mongoose.model('Plan', PlanSchema)