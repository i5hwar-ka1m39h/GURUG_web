"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/course');
app.use(express_1.default.json());
app.use((0, cors_1.default)());
//connecting to the db
mongoose_1.default.connect("mongodb://127.0.0.1:27017/gurugDB", { dbName: "gugugDB" });
app.use("/auth", authRoutes);
app.use("/course", courseRoutes);
//home page
app.get("/home", (req, res) => {
    res.send("this is home page!!!");
});
app.listen(3000, () => console.log("app is listening at port 3000"));
