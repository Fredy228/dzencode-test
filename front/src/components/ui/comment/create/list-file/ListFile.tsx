import { Dispatch, type FC, SetStateAction } from "react";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemIcon from "@mui/material/ListItemIcon";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";

type Props = {
  setFile: Dispatch<SetStateAction<File | null>>;
  type: "file" | "img";
  fileName: string;
};
const ListFile: FC<Props> = ({ setFile, fileName, type }) => {
  return (
    <List dense={true}>
      <ListItem
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => setFile(null)}
          >
            <DeleteIcon />
          </IconButton>
        }
      >
        <ListItemIcon>
          {type === "file" && <AttachFileIcon />}
          {type === "img" && <InsertPhotoIcon />}
        </ListItemIcon>
        <ListItemText
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          primary={fileName}
        />
      </ListItem>
    </List>
  );
};

export default ListFile;
