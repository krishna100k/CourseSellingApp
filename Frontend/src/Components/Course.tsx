/* eslint-disable react/prop-types */

import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "./AvailableCourses/availablecourses.module.css";

const Course = ({ title, imageLink, description, price, _id }) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate("/course/" + _id);
  };

  return (
    <div className={styles.card}>
      <img src={imageLink} alt="Cover" />
      <h2>{title}</h2>
      <p>{description}</p>
      <h6>$ {price}</h6>
      <Button onClick={handleEditClick}>Edit</Button>
    </div>
  );
};

export default Course;
