import { create } from "zustand/index";
import { CommentInterface } from "../interface/comment.interface";

interface StoreInterface {
  replyComment: CommentInterface | null;
  setReplyComment: (replyComment: CommentInterface | null) => void;
  refreshComments: boolean;
  actionRefresh: () => void;
}

const useStoreComment = create<StoreInterface>((set) => ({
  replyComment: null,
  setReplyComment: (replyComment: CommentInterface | null) =>
    set(() => ({ replyComment })),
  refreshComments: false,
  actionRefresh: () =>
    set((state) => ({ refreshComments: !state.refreshComments })),
}));

export default useStoreComment;
