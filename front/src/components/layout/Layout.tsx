import { type FC, Suspense, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { get } from "local-storage";

import Header from "../ui/header/Header";
import LoadingPage from "../ui/loading-page/LoadingPage";
import { UserInterface } from "../../interface/user.interface";
import { Notify } from "notiflix";
import useStoreComment from "../../global-state/store-comment";

const Layout: FC = () => {
  const [_socket, setSocket] = useState<Socket | null>(null);
  const actionRefresh = useStoreComment((state) => state.actionRefresh);

  useEffect(() => {
    const token = get("token");
    if (!token) return;

    const socketIO = io(process.env.REACT_APP_WEBSOCKET_URL, {
      timeout: 10000,
      auth: {
        token,
      },
      transports: ["websocket"],
    });

    setSocket(socketIO);

    socketIO.on("notification", (data: UserInterface) => {
      Notify.info(`User: ${data.name} replied to your comment`);
      actionRefresh();
    });

    return () => {
      socketIO.close();
    };
  }, []);
  return (
    <>
      <Header />
      <Suspense fallback={<LoadingPage />}>
        <Outlet />
      </Suspense>
    </>
  );
};

export default Layout;
