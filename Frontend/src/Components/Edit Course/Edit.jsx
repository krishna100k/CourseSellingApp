/* eslint-disable react/prop-types */
import axios from "axios";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./edit.module.css";
import { Card, TextField, Button, Typography, CircularProgress } from "@mui/material";
import { baseURL } from "../../config";
import { courseState } from "../../Recoil/Atoms/Course";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { courseTitle } from "../../Recoil/Selectors/course";
import { courseImage } from "../../Recoil/Selectors/course";
import { coursePrice } from "../../Recoil/Selectors/course";
import { courseDetails } from "../../Recoil/Selectors/course";

const Edit = () => {
  const setCourse = useSetRecoilState(courseState);

  const image = useRecoilValue(courseImage);
  const price = useRecoilValue(coursePrice)
  const course = useRecoilValue(courseDetails)
  const id = useParams().courseid;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const config1 = {
      headers: { Authorization: "Bearer " + token },
    };

    axios
      .get(`${baseURL}/admins/singleCourse/` + id, config1)
      .then((res) => {
        console.log(res.data);
        setCourse({
          isLoading:false,
          course: res.data
        });
      })
      .catch((error) => {
        console.error("Error fetching course data:", error);
      });
  }, [id, setCourse]);

  //Title Component
  const Title = () => {
    const title = useRecoilValue(courseTitle)
    return <h2>{title}</h2>
  }


  //   GrayBorderComponent
  const GrayBorder = () => {
    return (
      <div className={styles.grayBorder}>
        <h1><Title /></h1>
      </div>
    );
  };



  const Course = ({ imageLink, description, price }) => {
    return (
      <div className={styles.card}>
        <img src={imageLink} alt="Cover" />
        <Title />
        <p>{description}</p>
        <h6>$ {price}</h6>
      </div>
    );
  };

  const UpdateCourse = () => {
    
    const [title, setTitle] = useState(course.title);
    const [description, setDescription] = useState(course.description);
    const [price, setPrice] = useState(course.price);
    const [imageLink, setImageLink] = useState(course.imageLink);

    const token = localStorage.getItem("token");
    const submitHandler = () => {
      const course = {
        title,
        description,
        price,
        imageLink,
      };

      const config = {
        headers: { Authorization: "Bearer " + token },
      };

      axios
        .put(`${baseURL}/admins/courses/` + id, course, config)
        .then((res) => {
            console.log(res);
            axios.get(`${baseURL}/admins/singleCourse/` + id, config)
            .then( (res) => setCourse({
              isLoading: false,
              course: res.data
            }))
            .catch((err)=> console.log(err))
        })
        .catch((err)=> console.log(err))
    };

 

    return (
      <div>
        <div>
          <Card className={styles.form}>
            <Typography>Update course details</Typography>
            <TextField
              label=" Title"
              size="small"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
            <TextField
              label=" Description"
              size="small"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
            <TextField
              label=" ImageLink"
              size="small"
              onChange={(e) => setImageLink(e.target.value)}
              value={imageLink}
            />
            <TextField
              label=" Price"
              size="small"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            />
            <Button variant="contained" onClick={submitHandler}>
              Submit
            </Button>
          </Card>
        </div>
      </div>
    );
  };

  if (course) {
    return (
      <div>
        <GrayBorder  />
        <div className={styles.main}>
          <div className={styles.leftDiv}>
            <Course
              key={course._id}
              description={course.description}
              price={price}
              imageLink={image}
              _id={course._id}
            />
          </div>
          <div className={styles.rightDiv}>
            <UpdateCourse />
          </div>
        </div>
      </div>
    );
  } else return <CircularProgress />;
};

export default Edit;
