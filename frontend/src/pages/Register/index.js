import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  RegisterWrapper,
  RegisterCard,
  RegisterTitle,
  RegisterForm,
  FormGroup,
  FormLabel,
  RegisterInput,
  RegisterButton,
  PasswordWrapper,
  ToggleIcon,
} from "./element";
import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { username, password, confirmPassword } = formData;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post(
        "http://localhost:4000/register",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );

      navigate("/login");
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Registration failed. Please try again.");
      }
    }
  };

  return (
    <RegisterWrapper>
      <RegisterCard>
        <RegisterTitle>Create Your Account</RegisterTitle>

        <RegisterForm onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>Username</FormLabel>
            <RegisterInput
              type="text"
              name="username"
              placeholder="Enter your username"
              value={username}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Password</FormLabel>
            <PasswordWrapper>
              <RegisterInput
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={password}
                onChange={handleChange}
                required
              />
              <ToggleIcon onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </ToggleIcon>
            </PasswordWrapper>
          </FormGroup>

          <FormGroup>
            <FormLabel>Confirm Password</FormLabel>
            <PasswordWrapper>
              <RegisterInput
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={handleChange}
                required
              />
              <ToggleIcon onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </ToggleIcon>
            </PasswordWrapper>
          </FormGroup>

          {error && (
            <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>
          )}

          <RegisterButton
            type="submit"
            disabled={!username || !password || !confirmPassword}
          >
            Register
          </RegisterButton>
        </RegisterForm>
      </RegisterCard>
    </RegisterWrapper>
  );
};

export default RegisterPage;
