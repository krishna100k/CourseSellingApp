import "./Login.css";
import { useState } from "react";
import axios from "axios";
import { Card, TextField, Button } from "@mui/material";
import { baseURL } from "../../config";
import { useNavigate } from "react-router-dom";
import { userState } from "../../Recoil/Atoms/User";
import { useSetRecoilState } from "recoil";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const setUser = useSetRecoilState(userState)

  const navigate = useNavigate();

  const submitHandler = () => {
    const user = {
      username: username,
      password: password,
    };

    axios
      .post(`${baseURL}/admins/login`, user)
      .then((res)=>{
        console.log(res.data);
        localStorage.setItem("token", res.data.token);
        alert(res.data.message)
        setUser({
          username: username,
          isLoading: true
        })
        navigate("/")
      })
      .catch((err)=> {
        console.log(err.response)
        alert("User not found")
      })
  };

  // document.body.style.overflow = "hidden";

  return (
    <div>
      <div className="login-main">
        <Card className="card">
          <h2>Login</h2>
          <div className="inputs">
            <TextField
              className="input"
              fullWidth
              size="small"
              label="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              className="input"
              fullWidth
              size="small"
              label="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="button">
            <Button fullWidth variant="contained" onClick={submitHandler}>
              Login
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
