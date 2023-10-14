import styles from "./availablecourses.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Course from "../Course";
import { Typography, CircularProgress } from "@mui/material";
import { baseURL } from "../../config";
import { UserNameState } from "../../Recoil/Selectors/Username";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../../Recoil/Atoms/User";
import { isLoadingState } from "../../Recoil/Selectors/isLoading";


const AvailableCourses = () => {
  const [data, setData] = useState([]);
  const userName = useRecoilValue(UserNameState)
  const isLoading = useRecoilValue(isLoadingState)
  const setUser = useSetRecoilState(userState)

  console.log(userName)

  useEffect(() => {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: "Bearer " + token },
    };

    axios
      .get(`${baseURL}/admins/courses`, config)
      .then((res) => {
        setData(res.data);
        setUser((prevState) => ({
          ...prevState,
          isLoading: false,
        }))
      })
      .catch((err) => console.error(err));
  }, [setUser]);

  console.log(data);

  const GrayBorder = () => {
    return (
      <div className={styles.grayBorder}>
        <Typography variant="h4">Available Courses</Typography>
      </div>
    );
  };

  if(isLoading){
    return <CircularProgress />
  }

  if(userName){
    return (
      <div>
        <GrayBorder />
        <div className={styles.courseContainer}>
          {data.map((course) => {
            return (
              <Course
                key={course._id}
                title={course.title}
                description={course.description}
                price={course.price}
                imageLink={course.imageLink}
                _id={course._id}
              />
            );
          })}
        </div>
      </div>
    );
  }else{
    return(
      <div className={styles.landing}>
        <div className={styles.first}>
        <Typography variant="h1">Coursea</Typography>
        </div>
        <div className={styles.second}>
          <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Cover" />
        </div>

      </div>
    )
  }


};

export default AvailableCourses;
