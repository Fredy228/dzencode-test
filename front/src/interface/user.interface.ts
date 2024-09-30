export interface UserInterface {
  id: number;
  name: string;
  email: string;
  avatar_url: string;
  accessToken?: string;
  refreshToken?: string;
}
