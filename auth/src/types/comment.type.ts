export enum FileTypeEnum {
  IMAGE = 'img',
  FILE = 'file',
}

export type CommentFilesType = Array<{
  type: FileTypeEnum;
  name_file: string;
  path_to_file: string;
}>;
