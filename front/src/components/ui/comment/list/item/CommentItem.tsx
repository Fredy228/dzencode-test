import { type FC, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Stack,
  Link,
} from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import Lightbox from "yet-another-react-lightbox";
import AttachFileIcon from "@mui/icons-material/AttachFile";

import "yet-another-react-lightbox/styles.css";

import { CommentInterface } from "../../../../../interface/comment.interface";
import {
  createAuthImageUrl,
  createMainImageUrl,
} from "../../../../../service/create-image-url";
import useStore from "../../../../../global-state/store";
import useStoreComment from "../../../../../global-state/store-comment";
import { scrollToTop } from "../../../../../service/scroll-to-top";
import ConfirmModal from "../../../confirm-modal/ConfirmModal";
import Modal from "@mui/material/Modal";
import { deleteComment } from "../../../../../axios/backend/comment";
import { outputError } from "../../../../../service/output-error";

type Props = {
  comment: CommentInterface;
  level?: number;
};
const CommentItem: FC<Props> = ({ comment, level = 0 }) => {
  const user = useStore((state) => state.user);
  const setReply = useStoreComment((state) => state.setReplyComment);
  const actionRefresh = useStoreComment((state) => state.actionRefresh);

  const [isOpenImage, setIsOpenImage] = useState<boolean>(false);
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const uploadImage = comment.files.find((i) => i.type === "img");
  const uploadFile = comment.files.find((i) => i.type === "file");

  const handleDelete = (id: number) => {
    setIsLoading(true);

    deleteComment(id)
      .then(() => {
        actionRefresh();
      })
      .catch(outputError)
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Box sx={{ marginLeft: level * 2 + "rem", marginTop: "1rem" }}>
      <Paper elevation={2} sx={{ padding: "1rem" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "15px",
          }}
        >
          {level > 0 && <ReplyIcon sx={{ transform: "scaleY(-1)" }} />}

          <Avatar
            alt={comment.user.name}
            src={
              comment.user.avatar_url &&
              createAuthImageUrl(comment.user.avatar_url)
            }
          />
          <Typography variant="body1">
            <strong>
              {user?.email === comment.user.email ? "You" : comment.user.name}
            </strong>
            :
          </Typography>
          {user?.email === comment.user.email && (
            <Button
              sx={{ marginLeft: "auto" }}
              color={"error"}
              onClick={() => setIsShowModal(true)}
            >
              Delete
            </Button>
          )}
          <Button
            variant="text"
            sx={{ marginLeft: user?.email === comment.user.email ? "15px" : "auto"}}
            endIcon={<ReplyIcon />}
            onClick={() => {
              setReply(comment);
              scrollToTop();
            }}
          >
            Reply
          </Button>
        </Box>

        <Typography
          dangerouslySetInnerHTML={{
            __html: comment.text.split("\n").join("<br />"),
          }}
        />

        <Stack
          spacing={3}
          direction={"row"}
          alignItems={"center"}
          margin={"10px 0"}
        >
          {uploadImage && (
            <Paper
              sx={{
                width: "100px",
                height: "100px",
                overflow: "hidden",
                objectFit: "cover",
                cursor: "pointer",
              }}
            >
              <img
                alt={uploadImage.name_file}
                style={{ width: "100%", height: "100%" }}
                src={createMainImageUrl(uploadImage.path_to_file)}
                onClick={() => setIsOpenImage(true)}
                loading={"lazy"}
              />
            </Paper>
          )}

          {uploadFile && (
            <Paper
              sx={{
                width: "100px",
                height: "100px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <Link
                href={createMainImageUrl(uploadFile.path_to_file)}
                download={uploadFile.name_file}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  width: "100%",
                  height: "100%",
                  textDecoration: "none",
                  padding: "10px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AttachFileIcon />
                <Typography
                  fontSize={"small"}
                  sx={{
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "block",
                    width: "100%",
                  }}
                >
                  {uploadFile.name_file}
                </Typography>
              </Link>
            </Paper>
          )}
        </Stack>

        <Typography variant="caption">
          {new Date(comment.createAt).toLocaleDateString()}
        </Typography>
      </Paper>

      {uploadImage && (
        <Lightbox
          open={isOpenImage}
          close={() => setIsOpenImage(false)}
          slides={[{ src: createMainImageUrl(uploadImage.path_to_file) }]}
        />
      )}

      {comment.replies && comment.replies.length > 0 && (
        <Box sx={{ marginTop: "1rem" }}>
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} level={level + 1} />
          ))}
        </Box>
      )}

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
            text={"Do you want to delete message?"}
            closeModal={() => setIsShowModal(false)}
            fn={() => handleDelete(comment.id)}
            isLoading={isLoading}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default CommentItem;
