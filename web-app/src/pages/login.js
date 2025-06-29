import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { IoIosEyeOff } from "react-icons/io";
import Headline from "../components/Headline";
import InputField from "../components/InputField";
import { FaEllipsisH } from "react-icons/fa";
import "../styles/login.css";
import "../styles/logo.css";
import { useContext } from "react";
import { AuthContext } from "../contexts/userContext";
import LogoImg from "../assets/logoA.png";

const Login = (props) => {
  const { login } = useContext(AuthContext);
  const [apiCalled, setapiCalled] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setshowPass] = useState(false);
  const [err, setErr] = useState(false);

  const updateEmail = (e) => setEmail(e.target.value);
  const updatePassword = (e) => setPassword(e.target.value);

  const loginUser = (e) => {
    if (email && password) {
      setapiCalled(true);
      login({ email, password })
        .then((res) => {
          setapiCalled(false);
          navigate("/dashboard");
        })
        .catch((err) => {
          setErr(true);
          setTimeout(() => {
            setErr("");
          }, 3000);
          setapiCalled(false);
        });
    }
  };

  return (
    <div className="login">
      <div>
        <div className="logo-lg">
          <img src={LogoImg} style={{width:100, height:60}} />
        </div>
        <Headline text="Back" line="Login to continue using account" />

        <div className="container">
          <InputField
            style={{ width: "79%" }}
            icon={FaEnvelope}
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            changeHandler={updateEmail}
          />
          <InputField
            style={{ width: "79%" }}
            icon={FaEllipsisH}
            icon2={IoIosEyeOff}
            icon2Action={() => setshowPass(!showPass)}
            name="password"
            type={showPass ? "text" : "password"}
            placeholder="password"
            value={password}
            changeHandler={updatePassword}
            fieldStyle={{ width: "70%" }}
          />
        </div>
        {err ? <p className="error">Invalid Credentials</p> : ""}

        <div className="button-container">
          <button
            className="login-button"
            onClick={loginUser}
            disabled={apiCalled}
          >
            Login
          </button>
        </div>

        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          border: '1px solid #ccc', 
          borderRadius: '5px', 
          backgroundColor: '#f9f9f9',
          fontSize: '14px'
        }}>
          <p>Admin email: admin@admin.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;