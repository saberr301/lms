const express = require("express");
const app = express();
const path = require("path");
// packages
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

// connection to DB and cloudinary
const { connectDB } = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");

// routes
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const courseRoutes = require("./routes/course");
const forumRoutes = require("./routes/forum");
// middleware
app.use(express.json()); // to parse json body
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Started on PORT ${PORT}`);
});

// connections
connectDB();
cloudinaryConnect();

// mount routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/forum", forumRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send(`<div>
    This is Default Route  
    <p>Everything is OK</p>
    </div>`);
});
