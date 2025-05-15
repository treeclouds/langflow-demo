import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LoginWrapper,
  LoginCard,
  LoginTitle,
  LoginForm,
  FormGroup,
  FormLabel,
  LoginInput,
  LoginButton,
} from "./element";

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "wculmen" && password === "P@ssw0rd123") {
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
            <LoginInput
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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