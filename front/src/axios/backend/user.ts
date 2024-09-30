import $api from "./base";
import { UserInterface } from "../../interface/user.interface";

export const getUser = async (): Promise<UserInterface> => {
  const { data } = await $api.get<UserInterface>("/user");
  return data;
};
