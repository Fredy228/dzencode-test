export const createAuthImageUrl = (url: string): string => {
  return `${process.env.REACT_APP_SERVER_AUTH_URL}/static/${url}`;
};

export const createMainImageUrl = (url: string): string => {
  return `${process.env.REACT_APP_SERVER_BACKEND_URL}/static/${url}`;
};
