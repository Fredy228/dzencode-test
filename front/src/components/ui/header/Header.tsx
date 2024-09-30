import { type FC, useState } from "react";
import LogoDevIcon from "@mui/icons-material/LogoDev";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import AppBar from "@mui/material/AppBar";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LogoutIcon from "@mui/icons-material/Logout";
import { remove } from "local-storage";
import Container from "@mui/material/Container";

import useStore from "../../../global-state/store";
import { createAuthImageUrl } from "../../../service/create-image-url";
import ConfirmModal from "../confirm-modal/ConfirmModal";
import { logoutUser } from "../../../axios/auth/auth";
import { outputError } from "../../../service/output-error";

const Header: FC = () => {
  const user = useStore((state) => state.user);
  const clearUser = useStore((state) => state.clearUser);
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogout = async () => {
    logoutUser()
      .then(() => {
        clearUser();
        remove("token");
        setIsShowModal(false);
      })
      .catch(outputError)
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <AppBar>
        <Container maxWidth={"lg"}>
          <Box sx={{ height: "75px", display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                marginRight: "auto",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <LogoDevIcon
                sx={{
                  width: "45px",
                  height: "45px",
                }}
              />
              <Typography variant={"body2"}>dZENcode</Typography>
            </Box>
            <Button
              variant="outlined"
              sx={{ color: "#fff" }}
              onClick={() => setIsShowModal(true)}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
            {user && (
              <Typography sx={{ marginRight: "5px" }}>{user.name}</Typography>
            )}
            <Avatar
              sx={{ width: "45px", height: "45px" }}
              alt="User Avatar"
              src={user ? createAuthImageUrl(user.avatar_url) : undefined}
            />
          </Box>
        </Container>
      </AppBar>

      <Modal open={isShowModal} onClose={() => setIsShowModal(false)}>
        <Box
          sx={{
            maxWidth: "400px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <ConfirmModal
            text={"Do you want to come out?"}
            closeModal={() => setIsShowModal(false)}
            fn={() => handleLogout()}
            isLoading={isLoading}
          />
        </Box>
      </Modal>
    </>
  );
};

export default Header;
