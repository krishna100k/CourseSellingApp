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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJwt = exports.Course = exports.COURSES = void 0;
var express_1 = require("express");
var fs_1 = require("fs");
var jsonwebtoken_1 = require("jsonwebtoken");
var mongoose_1 = require("mongoose");
var router = express_1.default.Router();
// Reading ADMINS file
var ADMINS = [];
fs_1.default.readFile("admins.json", "utf-8", function (err, data) {
    if (err)
        throw err;
    ADMINS = JSON.parse(data);
});
//Reading Courses File
var COURSES = [];
exports.COURSES = COURSES;
fs_1.default.readFile("courses.json", "utf-8", function (err, data) {
    if (err)
        throw err;
    exports.COURSES = COURSES = JSON.parse(data);
});
var secret = "s3cr3t";
//defining mongoDb schemas
var adminSchema = new mongoose_1.default.Schema({
    username: String,
    password: String,
});
var courseSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean,
});
//defining mongoose models
var Admin = mongoose_1.default.model("Admin", adminSchema);
var Course = mongoose_1.default.model("Course", courseSchema);
exports.Course = Course;
// let originalKey;
var userName;
var authenticateJwt = function (req, res, next) {
    var authHeader = req.headers.authorization;
    if (authHeader) {
        var token = authHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(token, secret, function (err, user) {
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
router.post("/signup", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, admins, newAdmin, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password;
                return [4 /*yield*/, Admin.findOne({ username: username })];
            case 1:
                admins = _b.sent();
                if (!admins) return [3 /*break*/, 2];
                res.status(403).send({ message: "Admin Already Exists!" });
                return [3 /*break*/, 4];
            case 2:
                newAdmin = new Admin({ username: username, password: password });
                return [4 /*yield*/, newAdmin.save()];
            case 3:
                _b.sent();
                token = jsonwebtoken_1.default.sign({ username: username }, secret, { expiresIn: "1h" });
                res.send({ message: "Admin Account Created Successfully!", token: token });
                _b.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, admin, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password;
                return [4 /*yield*/, Admin.findOne({ username: username, password: password })];
            case 1:
                admin = _b.sent();
                if (admin) {
                    token = jsonwebtoken_1.default.sign({ username: username }, secret, { expiresIn: "1h" });
                    res.status(200).send({ message: "Logged in Successfully", token: token });
                }
                else {
                    res.status(403).send({ message: "Login Failed" });
                }
                return [2 /*return*/];
        }
    });
}); });
router.post("/courses", authenticateJwt, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, description, price, imageLink, published, course;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, title = _a.title, description = _a.description, price = _a.price, imageLink = _a.imageLink, published = _a.published;
                course = new Course({
                    title: title,
                    description: description,
                    price: price,
                    imageLink: imageLink,
                    published: published,
                });
                return [4 /*yield*/, course.save()];
            case 1:
                _b.sent();
                res.status(201).send({ message: "Course Created Successfully" });
                return [2 /*return*/];
        }
    });
}); });
router.put("/courses/:id", authenticateJwt, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, title, description, price, imageLink, published, course;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                _a = req.body, title = _a.title, description = _a.description, price = _a.price, imageLink = _a.imageLink, published = _a.published;
                return [4 /*yield*/, Course.findByIdAndUpdate(id, req.body)];
            case 1:
                course = _b.sent();
                if (course) {
                    res.status(200).send({ message: "Course Updated successfully" });
                }
                else {
                    res.status(404).send({ message: "Course Not Found" });
                }
                return [2 /*return*/];
        }
    });
}); });
router.get("/courses", authenticateJwt, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var courses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Course.find({})];
            case 1:
                courses = _a.sent();
                res.status(200).send(courses);
                return [2 /*return*/];
        }
    });
}); });
router.get("/singleCourse/:id", authenticateJwt, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, course, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Course.findById(id)];
            case 2:
                course = _a.sent();
                if (!course) {
                    return [2 /*return*/, res.status(404).send("Course not found")];
                }
                res.status(200).send(course);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error(error_1);
                res.status(500).send("Internal Server Error");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/me", authenticateJwt, function (req, res) {
    res.status(200).send(userName);
});
exports.default = router;
