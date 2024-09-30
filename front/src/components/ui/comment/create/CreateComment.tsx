import { type FC, FormEventHandler, useRef, useState } from "react";
import Textarea from "@mui/joy/Textarea";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import FileUpload from "./file-upload/FileUpload";
import SendIcon from "@mui/icons-material/Send";
import Typography from "@mui/joy/Typography";
import Notiflix from "notiflix";

import ListFile from "./list-file/ListFile";
import { commentCreateSchema } from "../../../../validate/comment.schema";
import { createComment } from "../../../../axios/backend/comment";
import { outputError } from "../../../../service/output-error";
import useStoreComment from "../../../../global-state/store-comment";

const listStyleBtn: Array<{ id: number; tag: string }> = [
  {
    id: 1,
    tag: "a",
  },
  {
    id: 2,
    tag: "code",
  },
  {
    id: 3,
    tag: "i",
  },
  {
    id: 3,
    tag: "strong",
  },
];

const CreateComment: FC = () => {
  const replyComment = useStoreComment((state) => state.replyComment);
  const setReply = useStoreComment((state) => state.setReplyComment);
  const actionRefresh = useStoreComment((state) => state.actionRefresh);
  const divTextRef = useRef<HTMLDivElement | null>(null);
  const [text, setText] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTagInsert = (tag: string) => {
    if (!divTextRef.current) return;
    const textarea = divTextRef.current.querySelector("textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selectedText = text.substring(start, end);
    const beforeText = text.substring(0, start);
    const afterText = text.substring(end);

    const newText = `${beforeText}<${tag}>${selectedText || `</${tag}>`}${selectedText ? `</${tag}>` : ""}${afterText}`;

    setText(newText);
    textarea.focus();
  };

  const handleTextarea = (value: string) => {
    setText((prevState) => {
      if (prevState.length >= 2000) return prevState;
      return value;
    });
  };

  const handleSubmitForm: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setIsLoading(true);

    const { error, value } = commentCreateSchema.validate({ text });
    if (error) {
      Notiflix.Notify.failure(error.message);
      setIsLoading(false);
      return;
    }

    createComment({ text, file, image, parentCommentId: replyComment?.id || 0 })
      .then(() => {
        Notiflix.Notify.success("Successfully create");
        setText("");
        setFile(null);
        setImage(null);
        setReply(null);
        actionRefresh();
      })
      .catch(outputError)
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form style={{ display: "flex", gap: "15px" }} onSubmit={handleSubmitForm}>
      <Box sx={{ flex: 1 }}>
        <Textarea
          id={"text-editor"}
          color="primary"
          ref={divTextRef}
          disabled={false}
          minRows={3}
          maxRows={3}
          size="md"
          variant="soft"
          placeholder="Enter text"
          sx={{ width: "100%" }}
          value={text}
          onChange={(e) => handleTextarea(e.target.value)}
          startDecorator={
            <>
              <ButtonGroup
                variant="contained"
                size="small"
                aria-label="Style button group"
              >
                {listStyleBtn.map((item) => (
                  <Button
                    key={item.id}
                    sx={{ textTransform: "lowercase" }}
                    onClick={() => handleTagInsert(item.tag)}
                  >
                    &lt;{item.tag}&gt;
                  </Button>
                ))}
              </ButtonGroup>
              <FileUpload setFile={setFile} setImage={setImage} />
            </>
          }
          endDecorator={
            <Typography level="body-xs" sx={{ ml: "auto" }}>
              {text.length}/2000 character(s)
            </Typography>
          }
        />
      </Box>
      <Box sx={{ width: "300px", display: "flex", flexDirection: "column" }}>
        {file && (
          <ListFile setFile={setFile} type={"file"} fileName={file.name} />
        )}
        {image && (
          <ListFile setFile={setImage} type={"img"} fileName={image.name} />
        )}
        <LoadingButton
          type={"submit"}
          variant="contained"
          endIcon={<SendIcon />}
          sx={{ marginTop: "auto" }}
          loading={isLoading}
        >
          Send
        </LoadingButton>
      </Box>
    </form>
  );
};

export default CreateComment;
