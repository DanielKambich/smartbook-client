import React, { useContext, useState } from "react";
import {
  Typography,
  Button,
  Container,
  Avatar,
  TextField,
  Link,
  useTheme,
  Box,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns"; // import
import { BookOutlined } from "@material-ui/icons";
import { AuthContext, baseURL } from "./constants";

const formErrors = {
  firstName: "First name cannot be empty",
  lastName: "Last name cannot be empty",
  birthday: "Birthday cannot be empty",
  username: "Username cannot be empty",
  password: "Password cannot be empty",
};

function SignUp() {
  // Setup form validation
  const { register, handleSubmit, errors, control } = useForm();
  const [creationError, setCreationError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Hook into form validation
  const { setAuthToken } = useContext(AuthContext);
  const onSubmit = async (formData) => {
    const user = {
      ...formData,
    };
    const tokenHeader = {
      "Content-Type": "application/json",
    };

    const tokenResponse = await fetch(`${baseURL}/create-user/`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: tokenHeader,
    });
    console.log(tokenResponse);
    const tokenResponseJson = await tokenResponse.json();
    console.log(tokenResponseJson);

    if (tokenResponseJson.status === "error") {
      setCreationError(tokenResponseJson.errorMessage);
    } else {
      localStorage.setItem("authToken", tokenResponseJson.token);
      setAuthToken(tokenResponseJson.token);
    }
  };

  // Get the theme
  const theme = useTheme();
  return (
    <div>
      <div>
        <Typography
          component="header"
          variant="h6"
          style={{ marginLeft: 50, marginTop: 50 }}
        >
          Welcome!
        </Typography>
      </div>
      <div>
        <Typography component="header" variant="h6" style={{ marginLeft: 50 }}>
          Create your account
        </Typography>
      </div>
      <Container component="main" maxWidth="xs">
        <div style={theme.paper}>
          <Avatar style={theme.avatar}>
            <BookOutlined />
          </Avatar>
          <Box mt={1} mb={4}>
            <Typography component="h1" variant="h5" align="center">
              Sign up
            </Typography>
          </Box>
          <form style={theme.form} noValidate onSubmit={handleSubmit(onSubmit)}>
            <TextField
              name="firstName"
              label="First Name"
              autoComplete="given-name"
              autoFocus
              required
              fullWidth
              margin="normal"
              variant="outlined"
              inputRef={register({ required: true, minLength: 1 })}
              error={errors.firstName != null}
              helperText={errors.firstName ? formErrors.firstName : ""}
            />
            <TextField
              name="lastName"
              label="Last Name"
              autoComplete="family-name"
              required
              fullWidth
              margin="normal"
              variant="outlined"
              inputRef={register({ required: true, minLength: 1 })}
              error={errors.lastName != null}
              helperText={errors.lastName ? formErrors.lastName : ""}
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                as={DatePicker}
                control={control}
                rules={{ required: true }}
                value={selectedDate}
                onChange={([selected]) => {
                  setSelectedDate(selected);
                  return selected;
                }}
                name="birthday"
                label="Birthday"
                clearable
                defaultValue={null}
                maxDate={Date()}
                required
                autoOk
                fullWidth
                format="MM/dd/yyyy"
                placeholder="MM/DD/YYYY"
                margin="normal"
                inputVariant="outlined"
                error={errors.birthday != null}
                helperText={errors.birthday ? formErrors.birthday : ""}
              />
            </MuiPickersUtilsProvider>
            <TextField
              name="username"
              label="Username"
              autoComplete="username"
              required
              fullWidth
              margin="normal"
              variant="outlined"
              inputRef={register({ required: true, minLength: 1 })}
              error={errors.username != null}
              helperText={errors.username ? formErrors.username : ""}
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              required
              fullWidth
              margin="normal"
              variant="outlined"
              inputRef={register({ required: true, minLength: 1 })}
              error={errors.password != null}
              helperText={errors.password ? formErrors.password : ""}
            />
            <FormControlLabel
              control={
                <Checkbox
                  inputRef={register}
                  name="librarian"
                  color="primary"
                  defaultValue={false}
                />
              }
              label="I am a librarian"
            />
            <Typography color="error" variant="body1">
              {creationError}
            </Typography>
            <Button
              type="submit"
              fullWidth
              color="primary"
              style={theme.submit}
              variant="contained"
            >
              Sign Up
            </Button>
            <Box marginY={2}>
              <Link href="/SignIn" variant="body2">
                Already have an account? Sign in
              </Link>
            </Box>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default SignUp;
