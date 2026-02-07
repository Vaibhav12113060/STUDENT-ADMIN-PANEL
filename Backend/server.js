const express = require("express");
const cors = require("cors");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
// const connectDB = require("../Backend/config/db");
const connectDB = require("./config/db");

// dot env configuration

dotenv.config();

// db configuration

connectDB();

// rest object

const app = express();

// Middlewares

// app.use(cors());

// app.use(
//   cors({
//     origin: "http://localhost:5173", // frontend URL
//     credentials: true,
//   }),
// );
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://student-admin-panel-wvu4.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow any vercel.app subdomain or localhost
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.includes("localhost")
      ) {
        return callback(null, true);
      }

      return callback(new Error("CORS policy violation"), false);
    },
    credentials: true,
  }),
);

// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   }),
// );

app.use(express.json());
app.use(morgan("dev"));

// Routes

// Student Route

app.use("/api/v1/student", require("./Routes/studentRecordRoutes"));

app.use("/", (req, res) => {
  return res.status(200).send("<h1>Welcome To Admin Panel</h1>");
});

// PORT

const PORT = process.env.PORT || 8000;

// listen

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`.bgCyan);
});
