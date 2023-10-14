import "./App.css";
import Appbar from "./Components/Appbar/Appbar";
import Signup from "./Components/Signup/Signup";
import Login from "./Components/Login/Login";
import { Routes, Route } from "react-router-dom";
import AddCourse from "./Components/AddCourse/AddCourse";
import Home from "./Components/Home/Home";
import Edit from "./Components/Edit Course/Edit";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { useEffect } from "react";
import axios from "axios";
import { baseURL } from "./config";
import { userState } from "./Recoil/Atoms/User";

function App() {
  return (
    <RecoilRoot>
    <div>
        <InitUser />
        <Appbar />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/addcourse" element={<AddCourse />} />
          <Route path="/" element={<Home />} />
          <Route path="/course/:courseid" element={<Edit />}></Route>
        </Routes>
    </div>
    </RecoilRoot>
  );
}

const InitUser = () => {

  const setUser = useSetRecoilState(userState)
  const token = localStorage.getItem("token");



  useEffect(()=>{

    const init = async () => {

      const config = {
        headers: { Authorization: "Bearer " + token },
      };
  
      try{
        if(token){
          const response = await axios.get(`${baseURL}/admins/me`, config)
          if(response.data){
            setUser({
              username: response.data,
              isLoading:false
            })
            }
          }else{
            setUser({
              username: null,
              isLoading: false
            })
        }
      }catch(err) {
        setUser({
          username: null,
          isLoading: false
        })
        console.log(err)
      }
  
    }

    init()
  }, [setUser, token])


  return <></>

};

export default App;
