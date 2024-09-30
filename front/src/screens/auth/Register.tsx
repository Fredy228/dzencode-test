import { type FC, FormEventHandler, useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import LoadingButton from "@mui/lab/LoadingButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { set } from "local-storage";
import Notiflix from "notiflix";

import SelectAvatar from "../../components/ui/select-avatar/SelectAvatar";
import { userRegisterSchema } from "../../validate/auth.schema";
import { registerUser } from "../../axios/auth/auth";
import { outputError } from "../../service/output-error";
import useStore from "../../global-state/store";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ReCAPTCHA from "react-google-recaptcha";

const RegisterPage: FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorFields, setErrorFields] = useState<Array<number | string>>([]);

  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);


  const setUser = useStore((state) => state.setUser);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMousePassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmitForm: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setErrorFields([]);
    setIsLoading(true);

    const { error, value } = userRegisterSchema.validate({
      name,
      password,
      email,
    });

    if (error) {
      error.details.forEach((i) => {
        if (i.path && i.path[0])
          setErrorFields((prevState) => [...prevState, i.path[0]]);
      });
      Notiflix.Notify.failure(error.message);
      setIsLoading(false);
      return;
    }

    registerUser({ ...value, image: image || undefined, captcha: captchaValue })
      .then((data) => {
        if (data.accessToken) set("token", data.accessToken);
        setUser(data);
      })
      .catch(outputError)
      .finally(() => setIsLoading(false));
  };

  return (
    <Box
      sx={{
        width: " 100vw",
        height: "100vh",
        minHeight: "600px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "450px",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            backgroundColor: "rgb(25, 118, 210)",
            margin: "10px auto 15px auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LockOutlinedIcon
            sx={{
              width: "30px",
              height: "30px",
              color: "#fff",
            }}
          />
        </Box>
        <Typography variant={"h2"} marginBottom={"10px"}>
          Sign up
        </Typography>
        <Typography variant={"body1"} marginBottom={"10px"} fontSize={"small"}>
          Welcome user, please sign up to continue
        </Typography>
        <form
          noValidate
          style={{
            display: "inline-flex",
            flexDirection: "column",
            gap: "15px",
            width: "100%",
            padding: "20px",
              alignItems: "center",
          }}
          onSubmit={handleSubmitForm}
        >
          <SelectAvatar setImage={setImage} image={image} />

          <TextField
            fullWidth
            id="email"
            label="Email address"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errorFields.includes("email")}
          />
          <TextField
            fullWidth
            id="name"
            label="User name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errorFields.includes("name")}
            variant="outlined"
          />
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errorFields.includes("password")}
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMousePassword}
                    onMouseUp={handleMousePassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

            <ReCAPTCHA
                sitekey={process.env.REACT_APP_RECAPTCHA_KEY!}
                onChange={setCaptchaValue}
            />

          <LoadingButton
            loading={isLoading}
            fullWidth
            variant="contained"
            type={"submit"}
            disabled={!captchaValue}
          >
            Sign up
          </LoadingButton>
        </form>

        <Link to={"/auth/login"}>Do you have an account? Sign in</Link>
      </Box>
    </Box>
  );
};

export default RegisterPage;
