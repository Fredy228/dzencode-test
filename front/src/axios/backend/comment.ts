import $api from "./base";
import { CommentCreateType, CommentGetType } from "../../type/comment.type";
import {
  CommentInterface,
  CommentManyInterface,
} from "../../interface/comment.interface";

export const createComment = async (
  body: CommentCreateType,
): Promise<CommentInterface> => {
  const formData = new FormData();
  formData.append("text", body.text);
  if (body.parentCommentId)
    formData.append("parentCommentId", String(body.parentCommentId));
  if (body.file) formData.append("file", body.file);
  if (body.image) formData.append("image", body.image);

  const { data } = await $api.post<CommentInterface>("/comment", formData);
  return data;
};

export const getAllComments = async ({
  filter,
  range,
  sort,
  comment_id = 0,
}: CommentGetType): Promise<CommentManyInterface> => {
  const params: Record<string, any> = {};
  if (filter) params.filter = JSON.stringify(filter);
  if (range) params.range = JSON.stringify(range);
  if (sort) params.sort = JSON.stringify(sort);

  const { data } = await $api.get<CommentManyInterface>(
    `/comment/${comment_id}`,
    {
      params,
    },
  );
  return data;
};

export const deleteComment = async (comment_id: number) => {
  await $api.delete(`/comment/${comment_id}`);
};
