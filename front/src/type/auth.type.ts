type TBaseAuthBody = {
  email: string;
  password: string;
  captcha: string;
};

export type TLoginBody = TBaseAuthBody;

export type TRegisterBody = {
  name: string;
  image?: File;
} & TBaseAuthBody;
