import { ChangeEvent, Dispatch, type FC, SetStateAction } from "react";
import { styled } from "@mui/material/styles";
import Notiflix from "notiflix";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import UploadIcon from "@mui/icons-material/Upload";
import Button from "@mui/material/Button";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

type Props = {
  image: File | null;
  setImage: Dispatch<SetStateAction<File | null>>;
};
const SelectAvatar: FC<Props> = ({ image, setImage }) => {
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size / (1024 * 1024) > 10)
        return Notiflix.Notify.failure(
          "The image cannot be larger than 10 mb.",
        );

      setImage(file);
    }
  };

  return (
    <Box
      sx={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "5px",
      }}
    >
      <Avatar
        sx={{ width: "75px", height: "75px" }}
        alt="User Avatar"
        src={image ? URL.createObjectURL(image) : undefined}
      />
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<UploadIcon />}
      >
        {image ? "Upload another" : "Upload avatar"}
        <VisuallyHiddenInput
          type="file"
          onChange={handleImageChange}
          multiple={false}
          accept="image/jpeg, image/png, image/jpg, image/webp"
        />
      </Button>
    </Box>
  );
};

export default SelectAvatar;
