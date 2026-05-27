import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./styles.css";

const EMPTY_REGISTRATION = {
  login_name: "",
  password: "",
  verifyPassword: "",
  first_name: "",
  last_name: "",
  location: "",
  description: "",
  occupation: "",
};

function getRegistrationValidationError(form) {
  const requiredFields = [
    "login_name",
    "password",
    "verifyPassword",
    "first_name",
    "last_name",
    "location",
    "description",
    "occupation",
  ];
  const hasMissingField = requiredFields.some((field) => !form[field].trim());

  if (hasMissingField) {
    return "Please fill in all registration fields.";
  }

  if (form.password !== form.verifyPassword) {
    return "Password and verify password must match.";
  }

  return "";
}

function LoginRegister({ onLogin, onRegister }) {
  const navigate = useNavigate();
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [registration, setRegistration] = useState(EMPTY_REGISTRATION);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateRegistration = (field, value) => {
    setRegistration((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!loginName.trim() || !password.trim()) {
      setError("Please enter both login name and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      const user = await onLogin({
        login_name: loginName.trim(),
        password,
      });
      navigate(`/users/${user._id}`);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = getRegistrationValidationError(registration);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      await onRegister({
        login_name: registration.login_name.trim(),
        password: registration.password,
        first_name: registration.first_name.trim(),
        last_name: registration.last_name.trim(),
        location: registration.location.trim(),
        description: registration.description.trim(),
        occupation: registration.occupation.trim(),
      });

      setLoginName(registration.login_name.trim());
      setPassword("");
      setRegistration(EMPTY_REGISTRATION);
      setSuccess("Registration successful. Please log in.");
    } catch (registerError) {
      setError(registerError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="login-register">
      <Box className="auth-panel" component="form" onSubmit={handleLogin}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <TextField
          autoComplete="username"
          label="Login name"
          margin="normal"
          onChange={(event) => setLoginName(event.target.value)}
          value={loginName}
          fullWidth
        />
        <TextField
          autoComplete="current-password"
          label="Password"
          margin="normal"
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          value={password}
          fullWidth
        />
        <Button
          disabled={isSubmitting}
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </Box>

      <Divider orientation="vertical" flexItem />

      <Box className="auth-panel" component="form" onSubmit={handleRegister}>
        <Typography variant="h5" gutterBottom>
          Register
        </Typography>
        <Box className="registration-grid">
          <TextField
            autoComplete="username"
            label="Login name"
            onChange={(event) =>
              updateRegistration("login_name", event.target.value)
            }
            value={registration.login_name}
          />
          <TextField
            autoComplete="new-password"
            label="Password"
            onChange={(event) =>
              updateRegistration("password", event.target.value)
            }
            type="password"
            value={registration.password}
          />
          <TextField
            autoComplete="new-password"
            label="Verify password"
            onChange={(event) =>
              updateRegistration("verifyPassword", event.target.value)
            }
            type="password"
            value={registration.verifyPassword}
          />
          <TextField
            label="First name"
            onChange={(event) =>
              updateRegistration("first_name", event.target.value)
            }
            value={registration.first_name}
          />
          <TextField
            label="Last name"
            onChange={(event) =>
              updateRegistration("last_name", event.target.value)
            }
            value={registration.last_name}
          />
          <TextField
            label="Location"
            onChange={(event) =>
              updateRegistration("location", event.target.value)
            }
            value={registration.location}
          />
          <TextField
            label="Occupation"
            onChange={(event) =>
              updateRegistration("occupation", event.target.value)
            }
            value={registration.occupation}
          />
          <TextField
            className="registration-description"
            label="Description"
            minRows={3}
            multiline
            onChange={(event) =>
              updateRegistration("description", event.target.value)
            }
            value={registration.description}
          />
        </Box>
        <Button
          disabled={isSubmitting}
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Register Me
        </Button>
      </Box>

      {(error || success) && (
        <Box className="auth-message">
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
        </Box>
      )}
    </Box>
  );
}

export default LoginRegister;
