import { type FC, useEffect, useRef, useState } from "react";
import {
  Box,
  Pagination,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import { CommentManyInterface } from "../../../../interface/comment.interface";
import CommentItem from "./item/CommentItem";
import { getAllComments } from "../../../../axios/backend/comment";
import { outputError } from "../../../../service/output-error";
import usePagination from "../../../../hooks/use-pagination";
import { CommentGetType } from "../../../../type/comment.type";
import { scrollToTop } from "../../../../service/scroll-to-top";
import useStoreComment from "../../../../global-state/store-comment";

const PAGE_SIZE: number = 25;

const CommentList: FC = () => {
  const { page, sort, setQuery } = usePagination();
  const refreshComments = useStoreComment((state) => state.refreshComments);

  const [list, setList] = useState<CommentManyInterface>({
    total: 0,
    data: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isFetching = useRef<boolean>(false);

  const handleSetPage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setQuery([{ field: "page", value: String(value) }]);
    scrollToTop();
  };

  const handleSetSort = (
    event: React.MouseEvent<HTMLElement>,
    newValue: string | null,
  ) => {
    if (newValue)
      setQuery([
        { field: "sort", value: JSON.stringify(["createAt", newValue]) },
        { field: "page", value: String(1) },
      ]);
  };

  useEffect(() => {
    if (isFetching.current) return;
    isFetching.current = true;
    setIsLoading(true);

    const optionsGet: CommentGetType = { comment_id: 0 };
    if (sort) optionsGet.sort = sort;
    optionsGet.range = [page * PAGE_SIZE - PAGE_SIZE + 1, page * PAGE_SIZE];

    getAllComments(optionsGet)
      .then((data) => setList(data))
      .catch(outputError)
      .finally(() => {
        setIsLoading(false);
        isFetching.current = false;
      });
  }, [page, sort, refreshComments]);

  return (
    <Box>
      <Stack
        marginTop={"15px"}
        direction={"row"}
        spacing={2}
        alignItems={"center"}
      >
        <Typography>SORT:</Typography>
        <ToggleButtonGroup
          exclusive
          value={sort ? sort[1] : "DESC"}
          onChange={handleSetSort}
        >
          <ToggleButton value={"DESC"}>First the new</ToggleButton>
          <ToggleButton value={"ASC"}>First the old</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      {list.data.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          sx={{
            margin: "25px 0",
          }}
          count={Math.ceil(list.total / PAGE_SIZE)}
          page={page}
          onChange={handleSetPage}
          color="primary"
        />
      </Box>

      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            bottom: "15px",
            left: "15px",
            zIndex: 40,
          }}
        >
          <CircularProgress size={30} />
        </Box>
      )}
    </Box>
  );
};

export default CommentList;
