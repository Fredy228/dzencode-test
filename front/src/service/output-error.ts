import { isAxiosError } from "axios";
import { Notify } from "notiflix";

export const outputError = (error: Error) => {
  if (isAxiosError(error) && error.response?.data?.message)
    return Notify.failure(error.response.data.message);

  return Notify.failure("Unknown error");
};
