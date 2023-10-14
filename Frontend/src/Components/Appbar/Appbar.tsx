import "./Appbar.css";
import { Button } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Link, useNavigate } from "react-router-dom";
import { UserNameState } from "../../Recoil/Selectors/Username";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../../Recoil/Atoms/User";

const Appbar = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#5d605b",
      },
    },
  });



  let navigate = useNavigate();

  const userName = useRecoilValue(UserNameState)
  const setUser = useSetRecoilState(userState)

  const logout = () => {
    localStorage.setItem("token", null);
    setUser({
      username: null,
      isLoading:false,
    })
  };


  if(userName){
    return (
      <div>
        <div className="appbar-main">
          <div className="content">
            <h1 onClick={() => navigate("/")}>Coursea</h1>
            <div className="buttons">
              <ThemeProvider theme={theme}>
                <Typography className="username" variant="h6">
                  {userName}
                </Typography>
                <Button variant="outlined" onClick={logout}>
                  Logout
                </Button>
              </ThemeProvider>
            </div>
          </div>
        </div>
      </div>
    )
  }else {
    return(
    <div>
        <div className="appbar-main">
          <div className="content">
            <h1 onClick={() => navigate("/")}>Coursea</h1>
            <div className="buttons">
              <ThemeProvider theme={theme}>
                <Button component={Link} to="/login" variant="outlined">
                  Login
                </Button>
                <Button component={Link} to="/signup" variant="outlined">
                  Signup
                </Button>
              </ThemeProvider>
            </div>
          </div>
        </div>
      </div>
      )
  }

};

export default Appbar;
