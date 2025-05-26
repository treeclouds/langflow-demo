import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // 1. Login POST request
    const res = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // 2. Store token from login response
    localStorage.setItem("token", data.token);

    // 3. Use token to get user info from /me endpoint
    const meRes = await fetch("http://localhost:4000/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });

    const meData = await meRes.json();

    if (!meRes.ok) {
      alert(meData.message || "Failed to get user info");
      return;
    }

    // 4. Store user info
    // Assuming your /me API returns { username: '...' } or { message: 'You are logged in as username' }
    // Adjust this according to your API response
    let usernameFromMe = meData.username;
    if (!usernameFromMe && meData.message) {
      usernameFromMe = meData.message.replace("You are logged in as ", "");
    }
    localStorage.setItem("personal_data", usernameFromMe);

    // 5. Navigate to the original or default page
    const from = location.state?.from?.pathname || "/home";
    navigate(from, { replace: true });

  } catch (err) {
    alert("Error connecting to server");
    console.error("Login error:", err);
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

          Don't have an account? <Link to="/register">Register</Link>
        </LoginForm>
      </LoginCard>
    </LoginWrapper>
  );
};

export default LoginPage;
