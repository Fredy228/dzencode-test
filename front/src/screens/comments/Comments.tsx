import { type FC } from "react";
import { Paper, Typography, Avatar, Box } from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import ClearIcon from "@mui/icons-material/Clear";
import Container from "@mui/material/Container";

import CreateComment from "../../components/ui/comment/create/CreateComment";
import CommentList from "../../components/ui/comment/list/CommentList";
import useStoreComment from "../../global-state/store-comment";
import IconButton from "@mui/material/IconButton";
import { createAuthImageUrl } from "../../service/create-image-url";

const Comments: FC = () => {
  const replyComment = useStoreComment((state) => state.replyComment);
  const setReply = useStoreComment((state) => state.setReplyComment);

  return (
    <Box sx={{ marginTop: "80px" }}>
      <Container maxWidth={"lg"}>
        <CreateComment />
        {replyComment && (
          <Paper
            elevation={1}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "5px",
              padding: "1rem",
            }}
          >
            <ReplyIcon />
            <Avatar
              alt={replyComment.user.name}
              src={
                replyComment.user.avatar_url &&
                createAuthImageUrl(replyComment.user.avatar_url)
              }
            />
            <Typography
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {replyComment.text}
            </Typography>
            <IconButton
              type={"button"}
              sx={{
                marginLeft: "auto",
              }}
              onClick={() => setReply(null)}
            >
              <ClearIcon />
            </IconButton>
          </Paper>
        )}
        <CommentList />
      </Container>
    </Box>
  );
};

export default Comments;
