const Response = require("../utils/handleError");
const SVGVectorMapSchema = require("./../models/svgVectorMap")

const get = async (req, res) => {
    try {
        const { codeName } = req.params;

        const map = await SVGVectorMapSchema.findOne({
            codeName: codeName
        }).lean()
        
        if (!map) {
            return res.status(404).json({
                message: "Không tìm thấy bản đồ"
            });
        }

        const {_id, ...rest} = map;

        res.status(201).json(Response({
            code: "success",
            data: {
                id: _id,
                ...rest,
            },
            message: ""
        }));
    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
}

module.exports = { get }