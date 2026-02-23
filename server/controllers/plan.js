const Response = require("../utils/handleError");
const PlanSchema = require("./../models/models")
const create = async (req, res) => {
    try {

        const payload = req.body;

        if (!payload?.title) {
            payload.title = "Lịch trình chưa đặt tên"
        }

        const plan = await PlanSchema.create(payload);

        res.status(201).json(Response({
            code: "success",
            data: {
                id: plan?.id || ""
            },
            message: "Created successfully"
        }));

    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
}

const get = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await PlanSchema.findById(id).lean();

        if (!plan) {
            return res.status(404).json({
                message: "Không tìm thấy lịch trình"
            });
        }

        const {_id, destinations, ...rest} = plan;

        res.status(201).json(Response({
            code: "success",
            data: {
                id: _id,
                destinations: destinations.map(x=> ({
                    codeName: x.codeName,
                    name: x.name,
                    id: x._id,
                    activities: x.activities,
                    day: x.day
                })),
                ...rest,
            },
            message: ""
        }));
    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
}

module.exports = { create, get }