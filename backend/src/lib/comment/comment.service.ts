import { HttpStatus, Injectable } from '@nestjs/common';

import { CommentDTO } from './comment.dto';
import { CommentRepository } from '../../repository/comment.repository';
import { CustomException } from '../../services/custom-exception';
import { Comment } from '../../entity/comment.entity';
import { QuerySearchDto } from './query-search.dto';
import { FileService } from '../../services/file/file.service';
import { CommentFilesType, FileTypeEnum } from '../../types/comment.type';
import { User } from '../../entity/user.entity';
import { ValidateService } from '../../services/validate/validate.service';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly fileService: FileService,
    private readonly validateService: ValidateService,
    private readonly socketGateway: SocketGateway,
  ) {}

  async create(
    user: User,
    body: CommentDTO,
    files: {
      file?: Array<Express.Multer.File>;
      image?: Array<Express.Multer.File>;
    },
  ): Promise<Comment> {
    const clearText = await this.validateService.sanitize(body.text);

    let parentComment: null | Comment = null;
    if (body.parentCommentId) {
      parentComment = await this.commentRepository.findOne({
        where: {
          id: body.parentCommentId,
        },
        relations: {
          user: true,
        },
        select: {
          user: {
            id: true,
            name: true,
            email: true,
          },
        },
      });
      if (!parentComment)
        throw new CustomException(HttpStatus.BAD_REQUEST, 'Not found message');
    }

    const filesArray: CommentFilesType = [];

    if (files.image && files.image[0]) {
      const { path, name } = await this.fileService.saveImage(
        files.image[0],
        [],
        {
          width: 320,
          height: 240,
          fit: 'inside',
        },
      );
      filesArray.push({
        name_file: name,
        path_to_file: path,
        type: FileTypeEnum.IMAGE,
      });
    }
    if (files.file && files.file[0]) {
      const res = await this.fileService.saveFile(files.file[0]);
      filesArray.push({
        ...res,
        type: FileTypeEnum.FILE,
      });
    }

    const newComment = this.commentRepository.create({
      text: clearText,
      user,
      parent_comment: parentComment,
      files: filesArray,
    });

    await this.commentRepository.save(newComment);

    if (parentComment) {
      this.socketGateway
        .sendNotification(parentComment.user.id)
        .catch(console.error);
    }

    return newComment;
  }

  async getAll(
    query: QuerySearchDto,
    commentId: number,
  ): Promise<{ data: Comment[]; total: number }> {
    let comment: Comment | null = null;

    if (commentId)
      comment = await this.commentRepository.findOne({
        where: {
          id: commentId,
        },
      });

    return this.commentRepository.getWithReplies(comment, query);
  }

  async delete(params: { user: User; commentId: number }) {
    await this.deleteRecursive({ ...params, isParent: true });
    return;
  }

  async deleteRecursive({
    user,
    commentId,
    isParent,
  }: {
    user?: User;
    commentId: number;
    isParent: boolean;
  }) {
    const comment = await this.commentRepository.findOne({
      where: {
        id: commentId,
      },
      relations: {
        user: isParent,
        replies: true,
      },
      select: {
        user: {
          id: true,
          email: true,
        },
      },
    });

    if (!comment)
      throw new CustomException(HttpStatus.NOT_FOUND, 'Your comment not found');

    if (isParent && comment?.user?.id !== user.id)
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        "You cannot delete someone else's comment",
      );

    if (comment?.files?.length)
      await this.fileService.deleteFiles([
        ...comment.files.map((i) => i.path_to_file),
      ]);

    const comments = comment.replies;
    for (const replay of comments) {
      await this.deleteRecursive({ commentId: replay.id, isParent: false });
    }

    await this.commentRepository.delete(comment.id);
  }
}
