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
exports.authenticateJwt = exports.Course = void 0;
const express_1 = __importDefault(require("express"));
// import fs from "fs";
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
// Reading ADMINS file
// let ADMINS = [];
// fs.readFile("admins.json", "utf-8", (err, data) => {
//   if (err) throw err;
//   ADMINS = JSON.parse(data);
// });
//Reading Courses File
// let COURSES = [];
// fs.readFile("courses.json", "utf-8", (err, data) => {
//   if (err) throw err;
//   COURSES = JSON.parse(data);
// });
const secret = "s3cr3t";
//defining mongoDb schemas
const adminSchema = new mongoose_1.default.Schema({
    username: String,
    password: String,
});
const courseSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean,
});
//defining mongoose models
const Admin = mongoose_1.default.model("Admin", adminSchema);
const Course = mongoose_1.default.model("Course", courseSchema);
exports.Course = Course;
// let originalKey;
let userName;
const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(token, secret, (err, user) => {
            var _a;
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            userName = (_a = req.user) === null || _a === void 0 ? void 0 : _a.username;
            next();
        });
    }
    else {
        res.sendStatus(401);
    }
};
exports.authenticateJwt = authenticateJwt;
// const adminAuthentication = (req, res, next) => {
//   const { username, password } = req.headers;
//   const foundAdmin = ADMINS.find(
//     (admin) => admin.userName === username && admin.password === password
//   );
//   if (foundAdmin) {
//     next();
//   } else {
//     res.status(403).send({ message: "Login Failed" });
//   }
// };
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const admins = yield Admin.findOne({ username });
    if (admins) {
        res.status(403).send({ message: "Admin Already Exists!" });
    }
    else {
        const newAdmin = new Admin({ username: username, password: password });
        yield newAdmin.save();
        const token = jsonwebtoken_1.default.sign({ username }, secret, { expiresIn: "1h" });
        res.send({ message: "Admin Account Created Successfully!", token: token });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const admin = yield Admin.findOne({ username, password });
    if (admin) {
        const token = jsonwebtoken_1.default.sign({ username }, secret, { expiresIn: "1h" });
        res.status(200).send({ message: "Logged in Successfully", token: token });
    }
    else {
        res.status(403).send({ message: "Login Failed" });
    }
}));
router.post("/courses", authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, price, imageLink, published } = req.body;
    const course = new Course({
        title,
        description,
        price,
        imageLink,
        published,
    });
    yield course.save();
    res.status(201).send({ message: "Course Created Successfully" });
}));
router.put("/courses/:id", authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { title, description, price, imageLink, published } = req.body;
    const course = yield Course.findByIdAndUpdate(id, req.body);
    if (course) {
        res.status(200).send({ message: "Course Updated successfully" });
    }
    else {
        res.status(404).send({ message: "Course Not Found" });
    }
}));
router.get("/courses", authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield Course.find({});
    res.status(200).send(courses);
}));
router.get("/singleCourse/:id", authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    try {
        const course = yield Course.findById(id);
        if (!course) {
            return res.status(404).send("Course not found");
        }
        res.status(200).send(course);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}));
router.get("/me", authenticateJwt, (req, res) => {
    res.status(200).send(userName);
});
exports.default = router;
