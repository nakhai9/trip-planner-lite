const mongoose = require("mongoose");

const ProvinceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        codeName: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        mergedInto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Province",
            default: null,
        },
        isMerged: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // thêm createdAt, updatedAt
    }
);

module.exports = mongoose.model("Province", ProvinceSchema);
