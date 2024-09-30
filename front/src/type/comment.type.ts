export type CommentCreateType = {
  text: string;
  parentCommentId?: number;
  file?: File | null;
  image?: File | null;
};

export type CommentGetType = {
  range?: [number, number];
  sort?: [string, string];
  filter?: {
    text?: string;
    user?: {
      email?: string;
      name?: string;
    };
  };
  comment_id: number;
};
