import express, {Request, Response, NextFunction} from "express";
// import fs from "fs";
import jwt from "jsonwebtoken";
import mongoose, { Schema, Document } from "mongoose";
const router = express.Router();

interface AdminSchema extends Document {
  username: String;
  password: String;
}

interface CourseSchema extends Document {
  title: String;
  description: String;
  price: Number;
  imageLink: String;
  published: Boolean;
}

interface UpdatedRequest extends Request {
  user: any;
}

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
const adminSchema: Schema<AdminSchema> = new mongoose.Schema({
  username: String,
  password: String,
});

const courseSchema: Schema<CourseSchema> = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
});

//defining mongoose models

const Admin = mongoose.model<AdminSchema>("Admin", adminSchema);
const Course = mongoose.model<CourseSchema>("Course", courseSchema);

// let originalKey;
let userName: String;

const authenticateJwt = (req:UpdatedRequest, res:Response, next:NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      userName = req.user?.username;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

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

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const admins = await Admin.findOne({ username });
  if (admins) {
    res.status(403).send({ message: "Admin Already Exists!" });
  } else {
    const newAdmin = new Admin({ username: username, password: password });
    await newAdmin.save();
    const token = jwt.sign({ username }, secret, { expiresIn: "1h" });
    res.send({ message: "Admin Account Created Successfully!", token: token });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username, password });
  if (admin) {
    const token = jwt.sign({ username }, secret, { expiresIn: "1h" });
    res.status(200).send({ message: "Logged in Successfully", token: token });
  } else {
    res.status(403).send({ message: "Login Failed" });
  }
});

router.post("/courses", authenticateJwt, async (req, res) => {
  const { title, description, price, imageLink, published } = req.body;
  const course = new Course({
    title,
    description,
    price,
    imageLink,
    published,
  });
  await course.save();
  res.status(201).send({ message: "Course Created Successfully" });
});

router.put("/courses/:id", authenticateJwt, async (req, res) => {
  const id = req.params.id;
  const { title, description, price, imageLink, published } = req.body;
  const course = await Course.findByIdAndUpdate(id, req.body);
  if (course) {
    res.status(200).send({ message: "Course Updated successfully" });
  } else {
    res.status(404).send({ message: "Course Not Found" });
  }
});

router.get("/courses", authenticateJwt, async (req, res) => {
  const courses = await Course.find({});
  res.status(200).send(courses);
});

router.get("/singleCourse/:id", authenticateJwt, async (req, res) => {
  let id = req.params.id;
  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).send("Course not found");
    }
    res.status(200).send(course);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/me", authenticateJwt, (req, res) => {
  res.status(200).send(userName);
});

// export { COURSES };
export { Course };
export { authenticateJwt };
export default router;
