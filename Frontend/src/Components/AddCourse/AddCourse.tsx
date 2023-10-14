import "./AddCourse.css";
import { useState } from "react";
import axios from "axios";
import { Card, TextField, Button } from "@mui/material";
const AddCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [published, setPublished] = useState("");

  const token = localStorage.getItem("token");
  const submitHandler = () => {
    const course = {
      title,
      description,
      price,
      imageLink,
      published,
    };

    const config = {
      headers: { Authorization: "Bearer " + token },
    };

    axios
      .post("http://localhost:3000/admins/courses", course, config)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div className="signup-main">
        <Card className="card">
          <h2>Add Course</h2>
          <div className="inputs">
            <TextField
              className="input"
              fullWidth
              size="small"
              label="Title"
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              className="input"
              fullWidth
              size="small"
              label="Description"
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
              className="input"
              fullWidth
              size="small"
              label="Price"
              onChange={(e) => setPrice(e.target.value)}
            />
            <TextField
              className="input"
              fullWidth
              size="small"
              label="ImageLink"
              onChange={(e) => setImageLink(e.target.value)}
            />
            <TextField
              className="input"
              fullWidth
              size="small"
              label="Published"
              onChange={(e) => setPublished(e.target.value)}
            />
          </div>
          <div className="button">
            <Button fullWidth variant="contained" onClick={submitHandler}>
              Signup
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AddCourse;
