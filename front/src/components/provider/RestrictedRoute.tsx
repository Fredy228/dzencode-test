import { type FC, PropsWithChildren, Suspense } from "react";
import { Navigate } from "react-router-dom";
import { get } from "local-storage";

import useStore from "../../global-state/store";
import LoadingPage from "../ui/loading-page/LoadingPage";

const RestrictedRoute: FC<PropsWithChildren> = ({ children }) => {
  const user = useStore((state) => state.user);

  const token = get("token");
  if (user || token) return <Navigate to={"/"} />;

  return <Suspense fallback={<LoadingPage />}>{children}</Suspense>;
};

export default RestrictedRoute;
