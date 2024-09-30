import $authAPI from "./base";
import { UserInterface } from "../../interface/user.interface";
import { TLoginBody, TRegisterBody } from "../../type/auth.type";

export const loginUser = async (
  credentials: TLoginBody,
): Promise<UserInterface> => {
  const { data } = await $authAPI.post("/auth/login", credentials);
  return data;
};

export const registerUser = async (
  credentials: TRegisterBody,
): Promise<UserInterface> => {
  const formData = new FormData();
  formData.append("email", credentials.email);
  formData.append("password", credentials.password);
  formData.append("name", credentials.name);
  formData.append("captcha", credentials.captcha);
  if (credentials.image) formData.append("image", credentials.image);

  const { data } = await $authAPI.post("/auth/register", formData);
  return data;
};

export const logoutUser = async (): Promise<void> => {
  await $authAPI.get("/auth/logout");
};
