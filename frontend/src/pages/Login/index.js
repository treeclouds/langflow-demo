import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { validCredentials } from "../../authConfig";
import {
  LoginWrapper,
  LoginCard,
  LoginTitle,
  LoginForm,
  FormGroup,
  FormLabel,
  LoginInput,
  LoginButton,
  PasswordWrapper,
  ToggleIcon,
} from "./element"; // make sure to add new styled-components

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      username === validCredentials.username &&
      password === validCredentials.password
    ) {
      localStorage.setItem("token", "random-token");
      const from = location.state?.from?.pathname || "/home";
      navigate(from, { replace: true });
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <LoginWrapper>
      <LoginCard>
        <LoginTitle>Sign In to Your Account</LoginTitle>

        <LoginForm onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>Username</FormLabel>
            <LoginInput
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Password</FormLabel>
            <PasswordWrapper>
              <LoginInput
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <ToggleIcon onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </ToggleIcon>
            </PasswordWrapper>
          </FormGroup>

          <LoginButton type="submit" disabled={!username || !password}>
            Sign In
          </LoginButton>
        </LoginForm>
      </LoginCard>
    </LoginWrapper>
  );
};

export default LoginPage;
