const { GUEST_USER_ID } = require("../common/constants");
const Response = require("../utils/handleError");
const PlanSchema = require("./../models/plan")
const bcrypt = require('bcryptjs');
const create = async (req, res) => {
    try {

        const payload = req.body;

        if (!payload?.title) {
            payload.title = "Lịch trình chưa đặt tên"
        }

        if (payload.accessCode) {
            payload.accessCode = await bcrypt.hashSync(payload.accessCode, 10);
        }

        const plan = await PlanSchema.create({
            ...payload,
            userId: payload.userId ? payload.userId : GUEST_USER_ID
        });

        res.status(201).json(Response({
            code: "success",
            data: {
                id: plan?.id || "",
                title: plan?.title || "",
                startDate: plan?.startDate || null,
                endDate: plan?.endDate || null,
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
        const { accessCode } = req.body ?? {};

        const plan = await PlanSchema.findById(id).lean();

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy lịch trình",
            });
        }

        const { _id, isPublic, accessCode: planAccessCode, ...rest } = plan;

        if (isPublic) {
            return res.status(200).json({
                success: true,
                data: {
                    id: _id,
                    ...rest,
                    canView: true,
                },
            });
        }

        if (!accessCode) {
            return res.status(200).json({
                success: true,
                data: { canView: false },
                message: "Lịch trình riêng tư",
            });
        }

        const isMatch = await bcrypt.compare(accessCode, planAccessCode);

        if (!isMatch) {
            return res.status(403).json({
                success: false,
                data: { canView: false },
                message: "Mã bảo vệ không hợp lệ",
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                id: _id,
                ...rest,
                canView: true,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống",
            error: error.message,
        });
    }
};

module.exports = { create, get }