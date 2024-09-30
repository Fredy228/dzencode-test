import { UserInterface } from "./user.interface";

export enum FileTypeEnum {
  IMAGE = "img",
  FILE = "file",
}

export type CommentFilesType = Array<{
  type: FileTypeEnum;
  name_file: string;
  path_to_file: string;
}>;

export interface CommentInterface {
  id: number;
  text: string;
  files: CommentFilesType;
  createAt: Date;
  replies: CommentInterface[];
  replies_total: number;
  user: UserInterface;
}

export interface CommentManyInterface {
  data: CommentInterface[];
  total: number;
}
