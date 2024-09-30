import { type FC } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";

type Props = {
  fn: () => void;
  text: string;
  closeModal: () => void;
  isLoading: boolean;
};
const ConfirmModal: FC<Props> = ({ fn, text, closeModal, isLoading }) => {
  return (
    <Box
      sx={{
        padding: "30px",
        borderRadius: " 5px",
        backgroundColor: "#fff",
        textAlign: "center",
      }}
    >
      <Typography fontSize={"medium"} marginBottom={"15px"}>
        {text}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
        }}
      >
        <Button variant="outlined" onClick={() => closeModal()}>
          Cancel
        </Button>
        <LoadingButton
          loading={isLoading}
          variant="contained"
          type={"button"}
          onClick={() => fn()}
        >
          Confirm
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default ConfirmModal;
