import "./Signup.css";
import axios from "axios";
import { useState } from "react";
import { Card, TextField, Button, } from "@mui/material";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = () => {

    if (!username) {
      alert("Please enter a username");
      return;
    }
    if (!password) {
      alert("Please enter a password");
      return;
    }

    const user = {
      username: username,
      password: password,
    };

    axios
      .post("http://localhost:3000/admins/signup", user)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        console.log(res);
        alert(res.data.message);
        window.location = "/";
      })
      .catch((err) => {
        alert(err.response.data.message);
        console.log(err);
      });
  };

  // document.body.style.overflow = "hidden";

  return (
    <div>
      <div className="signup-main">
        <Card className="card">
          <h2>Signup</h2>
          <div className="inputs">
            <TextField
              className="input"
              fullWidth
              size="small"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              className="input"
              fullWidth
              size="small"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

export default Signup;
