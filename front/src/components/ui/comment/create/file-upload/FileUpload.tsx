import { ChangeEvent, Dispatch, type FC, SetStateAction } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import { styled } from "@mui/material/styles";
import Notiflix from "notiflix";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  zIndex: 10,
  whiteSpace: "nowrap",
  width: 1,
});

type Props = {
  setImage: Dispatch<SetStateAction<File | null>>;
  setFile: Dispatch<SetStateAction<File | null>>;
};
const FileUpload: FC<Props> = ({ setImage, setFile }) => {
  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    type: "img" | "file",
    size: number,
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size / 1024 > size)
        return Notiflix.Notify.failure(
          `The image cannot be larger than ${size} kb.`,
        );

      if (type === "img") setImage(file);
      if (type === "file") setFile(file);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: "5px",
        alignItems: "center",
        marginLeft: "20px",
      }}
    >
      <IconButton>
        <label style={{ display: "contents", cursor: "pointer" }}>
          <VisuallyHiddenInput
            type="file"
            onChange={(e) => handleFileChange(e, "img", 10000)}
            multiple={false}
            accept="image/jpeg, image/png, image/jpg, image/gif"
          />
          <InsertPhotoIcon />
        </label>
      </IconButton>
      <IconButton>
        <label style={{ display: "contents", cursor: "pointer" }}>
          <VisuallyHiddenInput
            type="file"
            onChange={(e) => handleFileChange(e, "file", 100)}
            multiple={false}
            accept="text/plain"
          />
          <AttachFileIcon />
        </label>
      </IconButton>
    </Box>
  );
};

export default FileUpload;
