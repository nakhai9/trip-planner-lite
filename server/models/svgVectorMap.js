const mongoose = require("mongoose");

const SVGVectorMapSchema = new mongoose.Schema(
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
        svgVectorMapContent: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true, // thêm createdAt, updatedAt
    }
);

module.exports = mongoose.model(
    "SVGVectorMap",
    SVGVectorMapSchema,
    "svg_vector_map"  
);
