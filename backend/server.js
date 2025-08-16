require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const appointmentsRouter = require("./routes/appointments");
const notificationsRouter = require("./routes/notifications");
const departmentsRouter = require("./routes/departments");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
// allow larger payloads because frontend may send base64 dataUrls for uploaded files
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/appointments", appointmentsRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/departments", departmentsRouter);

app.get("/", (req, res) =>
  res.json({ ok: true, msg: "LankaGuide backend running" })
);

async function start() {
  try {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/lankaguide";
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`Server listening on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

start();
