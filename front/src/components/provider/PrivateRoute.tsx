import { type FC, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { get } from "local-storage";

import useStore from "../../global-state/store";

const PrivateRoute: FC<PropsWithChildren> = ({ children }) => {
  const user = useStore((state) => state.user);

  const token = get("token");
  if (!token || !user) return <Navigate to={"/auth/login"} />;

  return <>{children}</>;
};

export default PrivateRoute;
