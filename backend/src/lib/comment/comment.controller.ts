import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { JoiPipe } from 'nestjs-joi';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as Joi from 'joi';

import { CommentService } from './comment.service';
import { CommentDTO } from './comment.dto';
import { ReqProtectedType } from '../../types/protect.type';
import { QuerySearchDto } from './query-search.dto';
import { Comment } from '../../entity/comment.entity';
import { FileValidatorPipe } from '../../pipe/validator-file.pipe';
import { QueryValidationPipe } from '../../pipe/query-parse.pipe';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/')
  @HttpCode(201)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
  )
  @UsePipes(
    new FileValidatorPipe([
      {
        maxSize: 1024 * 10,
        mimetype: 'image',
        type: ['png', 'jpg', 'jpeg', 'gif'],
      },
      {
        maxSize: 100,
        mimetype: 'text',
        type: ['plain'],
      },
    ]),
  )
  async createComment(
    @Req() { user }: ReqProtectedType,
    @Body(JoiPipe) body: CommentDTO,
    @UploadedFiles()
    files: {
      file?: Array<Express.Multer.File>;
      image?: Array<Express.Multer.File>;
    },
  ): Promise<Comment> {
    return this.commentService.create(user, body, files);
  }

  @Get('/:comment_id')
  @HttpCode(HttpStatus.OK)
  async getAllComments(
    @Query(new QueryValidationPipe(['range', 'sort', 'filter']), JoiPipe)
    query: QuerySearchDto,
    @Param(
      'comment_id',
      new JoiPipe(Joi.number().integer().allow(0).required()),
    )
    commentId: number,
  ): Promise<{ data: Comment[]; total: number }> {
    return this.commentService.getAll(query, commentId);
  }

  @Delete('/:comment_id')
  @HttpCode(HttpStatus.OK)
  async deleteComment(
    @Req() { user }: ReqProtectedType,
    @Param(
      'comment_id',
      new JoiPipe(Joi.number().integer().allow(0).required()),
    )
    commentId: number,
  ) {
    return this.commentService.delete({ user, commentId });
  }
}
