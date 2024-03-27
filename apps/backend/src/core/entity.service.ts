import { PrismaService } from '@rt/prisma';
import { IPaginationOptions, IPaginationResult, orderByBuilder } from '@rt/backend/shared/utils';
import { SortOrder } from '@rt/backend/shared/enums/sort-order.enum';
import { filterBuilder } from '@rt/backend/shared/utils';

export abstract class EntityService<Entity> {
  constructor(readonly prismaService: PrismaService) {}

  abstract get model(): string;
  abstract get filterFields(): Record<keyof any, any>;
  abstract get selectFields(): Record<keyof any, boolean>;

  findAll = async (options: IFindAllOptions): Promise<IPaginationResult<Entity>> => {
    const { skip, limit, filter, sort, extraWhereClause } = options;

    const FILTER_CLAUSE = {};
    const ORDER_BY_CLAUSE = orderByBuilder<Partial<Entity>>(sort as any);

    if (filter) {
      Object.assign(FILTER_CLAUSE, { OR: filterBuilder(this.filterFields, filter) });
    }

    Object.entries(extraWhereClause || {}).forEach(([key, value]) => {
      if (value) {
        Object.assign(FILTER_CLAUSE, { [key]: value });
      }
    });

    const [total, data] = await this.prismaService.$transaction([
      this.prismaService[this.model].count({
        ...((filter || extraWhereClause) && {
          where: FILTER_CLAUSE,
        }),
      }),
      this.prismaService[this.model].findMany({
        select: this.selectFields,
        ...(skip && { skip }),
        take: limit,
        ...((filter || extraWhereClause) && {
          where: FILTER_CLAUSE,
        }),
        ...(sort && {
          orderBy: ORDER_BY_CLAUSE,
        }),
      }),
    ]);

    return {
      total,
      data,
    };
  };
}

export interface IFindAllOptions extends IPaginationOptions {
  filter?: string;
  sort?: Record<string, SortOrder>;
  extraWhereClause?: Record<string, any>;
}
