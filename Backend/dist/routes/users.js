"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
// import { COURSES } from "./admins.js";
const admins_js_1 = require("./admins.js");
const admins_js_2 = require("./admins.js");
const router = express_1.default.Router();
// Reading Users File
// let USERS = [];
// fs.readFile("users.json", "utf-8", (err, data) => {
//   if (err) throw err;
//   USERS = JSON.parse(data);
// });
//Reading Purchased File
// let purchasedCourses = [];
// fs.readFile("purchased.json", "utf-8", (err, data) => {
//   if (err) throw err;
//   purchasedCourses = JSON.parse(data);
// });
const secret = "s3cr3t";
//Defining the Schema
const userSchema = new mongoose_1.default.Schema({
    username: String,
    password: String,
    purchasedCourses: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Course' }]
});
//Defining the model
const User = mongoose_1.default.model('User', userSchema);
// const userAuthentication = (req, res, next) => {
//     const {username, password} = req.headers;
//     const foundUser = USERS.find(user => user.userName === username && user.password === password);
//     if(foundUser) {
//         next();
//     }else {
//         res.status(401).json({message:"Login Failed"});
//     }
// }
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield User.findOne({ username });
    if (user) {
        res.status(401).json({ message: "User already exists" });
    }
    else {
        const newuser = new User({ username: username, password: password });
        yield newuser.save();
        const token = jsonwebtoken_1.default.sign({ username }, secret, { expiresIn: "1hr" });
        res.json({ message: "User added successfully", token: token });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.headers;
    const user = yield User.findOne({ username, password });
    if (user) {
        const token = jsonwebtoken_1.default.sign({ username }, secret, { expiresIn: "1hr" });
        res.status(200).send({ message: "Logged In Successfully", token: token });
    }
    else {
        res.status(403).send({ message: "User not found" });
    }
}));
router.get("/courses", admins_js_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield admins_js_2.Course.find({ published: true });
    res.status(200).send(course);
}));
router.post("/courses/:id", admins_js_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield admins_js_2.Course.findById(req.params.id);
    if (course) {
        const user = yield User.findOne({ username: req.user.username });
        if (user) {
            user.purchasedCourses.push(course);
            yield user.save();
            res.json({ message: 'Course Purchased Successfully' });
        }
        else {
            res.status(401).json({ message: "User not found" });
        }
    }
    else {
        res.status(404).json({ message: "Course not found" });
    }
}));
router.get("/purchasedCourses", admins_js_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findOne({ username: req.user.username }).populate('purchasedCourses');
    if (user) {
        res.status(200).send(user.purchasedCourses);
    }
    else {
        res.status(401).json({ message: "User not found" });
    }
}));
exports.default = router;
