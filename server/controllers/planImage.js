const { GUEST_USER_ID } = require("../common/constants");
const Response = require("../utils/handleError");
const PlanImageSchema = require("./../models/planImage")
const create = async (req, res) => {
    try {

        const {userId, url} = req.body;
        if (!url) {
            return res.status(400).json(Response({
                success:false,
                message: "Url không được để trống"
            }))
        }
        const record = await PlanImageSchema.create({
            userId: userId ? userId : GUEST_USER_ID,
            url: url
        })
        
        res.status(201).json(Response({
            success: true,
            data: {
                id: record._id
            }
        }))
    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
}

module.exports = { create }