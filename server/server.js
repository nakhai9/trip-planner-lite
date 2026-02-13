require("dotenv").config();
const express = require("express");
const cors = require("cors");

const uploadRouter = require("./routes/upload");
const planRouter = required("./routes/plan");

const app = express();

// Middleware parse JSON
app.use(express.json());
app.use(cors());
app.use(express.json());

// Route test
app.get("/", (req, res) => {
    res.send("Server Node.js đang chạy 🚀");
});

// API ví dụ
app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello World" });
});

app.use("/api/upload/", uploadRouter);
app.use("/api/plans", planRouter)


// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT || 3000}`);
});
