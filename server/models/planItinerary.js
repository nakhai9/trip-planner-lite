const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    description: String,
    location: {
        coordinates: {
            type: [Number], // [lng, lat]
            required: true
        }
    },
});

const ItinerarySchema = new mongoose.Schema({
   day: {
        type: Number,
        required: true
    },
    destination: {
        codeName: String,
        name: String
    },
    activities: [ActivitySchema],
});

const PlanItinerarySchema = new mongoose.Schema({
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan'
    },
    itineraries: [ItinerarySchema]
    
}, {
    versionKey: false,
    timestamps: true
})

PlanItinerarySchema.index({ planId: 1, day: 1 }, { unique: true });

// 👉 Ý nghĩa:
// Tạo index theo:
// planId
// day
// { unique: true } = KHÔNG cho phép trùng
// 📌 Hiểu đơn giản:

// 👉 Trong 1 plan, mỗi day chỉ được tồn tại 1 lần

// 🔥 Ví dụ:
// ✅ Hợp lệ:
// { planId: "A", day: 1 }
// { planId: "A", day: 2 }

// ❌ Lỗi(bị duplicate):
// { planId: "A", day: 1 }
// { planId: "A", day: 1 } // ❌ bị chặn

module.exports = mongoose.model('PlanItinerary', PlanItinerarySchema, "plan_itineraries" )