import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { IsNull } from 'typeorm';

import { Comment } from '../entity/comment.entity';
import { QuerySearchDto } from '../lib/comment/query-search.dto';

@Injectable()
export class CommentRepository extends Repository<Comment> {
  constructor(private dataSource: DataSource) {
    super(Comment, dataSource.createEntityManager());
  }

  async getWithReplies(
    parentComment: Comment | null,
    { sort = ['createAt', 'DESC'], range = [1, 25], filter }: QuerySearchDto,
  ): Promise<{ data: Comment[]; total: number }> {
    const whereOption =
      filter && Object.keys(filter).length > 0
        ? filter
        : {
            parent_comment: parentComment ? { id: parentComment.id } : IsNull(),
          };

    const [comments, total] = await this.findAndCount({
      where: whereOption,
      relations: {
        user: true,
      },
      select: {
        user: {
          id: true,
          email: true,
          name: true,
          avatar_url: true,
        },
      },
      order: {
        [sort[0]]: sort[1],
      },
      take: range[1] - range[0] + 1,
      skip: range[0] - 1,
    });

    for (const comment of comments) {
      const res = await this.getWithReplies(comment, {});
      comment.replies = res.data;
      comment['replies_total'] = res.total;
    }

    return { data: comments, total };
  }
}
