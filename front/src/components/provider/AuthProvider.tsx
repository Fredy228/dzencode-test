import { type FC, PropsWithChildren, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "local-storage";
import Notiflix from "notiflix";

import useStore from "../../global-state/store";
import { getUser } from "../../axios/backend/user";
import LoadingPage from "../ui/loading-page/LoadingPage";

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isFetching = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isFetching.current) return;
    const token = get("token");
    if (!token) return navigate("/auth/login");

    if (!user) {
      isFetching.current = true;
      getUser()
        .then((data) => {
          setUser(data);
          setIsLoading(false);
          isFetching.current = false;
        })
        .catch(() =>
          Notiflix.Notify.failure("Something went wrong. Reload page."),
        );
    } else setIsLoading(false);
  }, [navigate, setUser, user]);

  if (isLoading) return <LoadingPage />;

  return <>{children}</>;
};

export default AuthProvider;
