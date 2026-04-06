require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")

const connectDB = require("./configs/mongodbConfig");

const uploadRouter = require("./routes/upload");
const planRouter = require("./routes/plan");
const provinceRouter = require("./routes/province")
const svgVectorMapRouter = require("./routes/svgVectorMap");
const planImageRouter = require("./routes/planImage");
const checkHealthRouter = require("./routes/health");
const planItineraryRouter = require('./routes/planItinerary')
const app = express();

// Middleware parse JSON
app.use(express.json());
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB()
// Route test
app.get("/", (req, res) => {
    res.send("Server Node.js đang chạy 🚀");
});

// API ví dụ
app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello World" });
});

app.use("/health", checkHealthRouter)
app.use("/api/upload/", uploadRouter);
app.use("/api/plans", planRouter);
app.use('/api/provinces', provinceRouter)
app.use("/api/svg-vector-map", svgVectorMapRouter)
app.use("/api/plan-images", planImageRouter)
app.use("/api/plan-itineraries", planItineraryRouter)

// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT || 3000}`);
});
