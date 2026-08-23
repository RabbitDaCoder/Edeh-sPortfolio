import { Collection, Document, MongoClient, ObjectId, Sort } from "mongodb";
import { env } from "./env";

type Direction = "asc" | "desc";
type QueryArgs = {
  where?: Record<string, unknown>;
  data?: Record<string, unknown>;
  select?: Record<string, boolean>;
  include?: Record<string, unknown>;
  orderBy?: Record<string, Direction> | Array<Record<string, Direction>>;
  skip?: number;
  take?: number;
};

const client = new MongoClient(env.DATABASE_URL);

const collectionNames = {
  user: "User",
  blog: "Blog",
  article: "Article",
  book: "Book",
  careerTimeline: "CareerTimeline",
  achievement: "Achievement",
  download: "Download",
  newsletterSubscriber: "NewsletterSubscriber",
  contactMessage: "ContactMessage",
  project: "Project",
  skill: "Skill",
  testimonial: "Testimonial",
  siteProfile: "SiteProfile",
  polaroid: "Polaroid",
  comment: "Comment",
  guestbookEntry: "GuestbookEntry",
  notification: "Notification",
} as const;

const objectIdFields = new Set([
  "id",
  "_id",
  "blogId",
  "parentId",
  "guestbookEntryId",
  "commentId",
]);

function toObjectId(value: unknown): unknown {
  if (value instanceof ObjectId) return value;
  if (typeof value === "string" && ObjectId.isValid(value)) {
    return new ObjectId(value);
  }
  return value;
}

function normalizeValue(field: string, value: unknown): unknown {
  if (value === undefined) return undefined;

  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  ) {
    const operators = value as Record<string, unknown>;
    const normalized: Record<string, unknown> = {};

    if ("not" in operators)
      normalized.$ne = normalizeValue(field, operators.not);
    if ("gt" in operators) normalized.$gt = normalizeValue(field, operators.gt);
    if ("gte" in operators)
      normalized.$gte = normalizeValue(field, operators.gte);
    if ("lt" in operators) normalized.$lt = normalizeValue(field, operators.lt);
    if ("lte" in operators)
      normalized.$lte = normalizeValue(field, operators.lte);
    if ("in" in operators) {
      normalized.$in = Array.isArray(operators.in)
        ? operators.in.map((item) => normalizeValue(field, item))
        : operators.in;
    }

    return Object.keys(normalized).length ? normalized : operators;
  }

  if (objectIdFields.has(field)) return toObjectId(value);
  return value;
}

function normalizeWhere(
  where: Record<string, unknown> = {},
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(where)
      .map(([key, value]) => {
        const field = key === "id" ? "_id" : key;
        return [field, normalizeValue(key, value)];
      })
      .filter(([, value]) => value !== undefined),
  );
}

function normalizeData(
  data: Record<string, unknown> = {},
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(data)
      .map(([key, value]) => [key, normalizeValue(key, value)])
      .filter(([, value]) => value !== undefined),
  );
}

function projectionFromSelect(
  select?: Record<string, boolean>,
): Record<string, 0 | 1> | undefined {
  if (!select) return undefined;

  const projection: Record<string, 0 | 1> = {};
  for (const [key, enabled] of Object.entries(select)) {
    projection[key === "id" ? "_id" : key] = enabled ? 1 : 0;
  }
  return projection;
}

function sortFromOrderBy(orderBy?: QueryArgs["orderBy"]): Sort | undefined {
  if (!orderBy) return undefined;

  const parts = Array.isArray(orderBy) ? orderBy : [orderBy];
  return parts.reduce<Record<string, 1 | -1>>((sort, part) => {
    for (const [key, direction] of Object.entries(part)) {
      sort[key] = direction === "asc" ? 1 : -1;
    }
    return sort;
  }, {});
}

function serializeDocument<T = Record<string, unknown>>(
  doc: Document | null,
): T | null {
  if (!doc) return null;

  const { _id, ...rest } = doc;
  const serialized: Record<string, unknown> = {
    id: _id instanceof ObjectId ? _id.toHexString() : _id,
    ...rest,
  };

  for (const [key, value] of Object.entries(serialized)) {
    if (value instanceof ObjectId) serialized[key] = value.toHexString();
  }

  return serialized as T;
}

function applyWriteDefaults(
  model: string,
  data: Record<string, unknown>,
  isCreate: boolean,
) {
  const now = new Date();
  const next = { ...data };

  if (isCreate && next.createdAt === undefined) next.createdAt = now;
  if (model !== "achievement" && next.updatedAt === undefined)
    next.updatedAt = now;
  if (
    model === "newsletterSubscriber" &&
    isCreate &&
    next.subscribedAt === undefined
  ) {
    next.subscribedAt = now;
  }
  if (model === "contactMessage" && isCreate && next.read === undefined)
    next.read = false;
  if (model === "notification" && isCreate && next.read === undefined)
    next.read = false;

  return next;
}

class MongoModel {
  constructor(
    private readonly model: keyof typeof collectionNames,
    private readonly collection: Collection,
  ) {}

  async findUnique(args: QueryArgs) {
    return this.findFirst(args);
  }

  async findFirst(args: QueryArgs = {}) {
    const docs = await this.findMany({ ...args, take: 1 });
    return docs[0] ?? null;
  }

  async findMany(args: QueryArgs = {}) {
    const cursor = this.collection.find(normalizeWhere(args.where), {
      projection: projectionFromSelect(args.select),
    });

    const sort = sortFromOrderBy(args.orderBy);
    if (sort) cursor.sort(sort);
    if (args.skip) cursor.skip(args.skip);
    if (args.take) cursor.limit(args.take);

    const docs = (await cursor.toArray()).map((doc) => serializeDocument(doc));
    return this.applyIncludes(docs, args.include);
  }

  async count(args: QueryArgs = {}) {
    return this.collection.countDocuments(normalizeWhere(args.where));
  }

  async create(args: QueryArgs) {
    const data = applyWriteDefaults(this.model, normalizeData(args.data), true);
    const result = await this.collection.insertOne(data);
    const doc = await this.collection.findOne(
      { _id: result.insertedId },
      { projection: projectionFromSelect(args.select) },
    );
    return serializeDocument(doc);
  }

  async update(args: QueryArgs) {
    const data = applyWriteDefaults(
      this.model,
      normalizeData(args.data),
      false,
    );
    const $inc = this.extractIncrements(data);
    const $set = Object.fromEntries(
      Object.entries(data).filter(([, value]) => !this.isIncrement(value)),
    );

    const update: Record<string, unknown> = {};
    if (Object.keys($set).length) update.$set = $set;
    if (Object.keys($inc).length) update.$inc = $inc;

    const result = await this.collection.findOneAndUpdate(
      normalizeWhere(args.where),
      update,
      {
        returnDocument: "after",
        projection: projectionFromSelect(args.select),
      },
    );

    return serializeDocument(result);
  }

  async updateMany(args: QueryArgs) {
    const data = applyWriteDefaults(
      this.model,
      normalizeData(args.data),
      false,
    );
    return this.collection.updateMany(normalizeWhere(args.where), {
      $set: data,
    });
  }

  async delete(args: QueryArgs) {
    const doc = await this.collection.findOneAndDelete(
      normalizeWhere(args.where),
    );
    return serializeDocument(doc);
  }

  async upsert(
    args: QueryArgs & {
      create?: Record<string, unknown>;
      update?: Record<string, unknown>;
    },
  ) {
    const createData = applyWriteDefaults(
      this.model,
      normalizeData(args.create),
      true,
    );
    const where = normalizeWhere(args.where);
    const updateData = Object.fromEntries(
      Object.entries(
        applyWriteDefaults(this.model, normalizeData(args.update), false),
      ).filter(([key]) => !(key in where)),
    );
    const insertOnlyData = Object.fromEntries(
      Object.entries(createData).filter(([key]) => !(key in updateData)),
    );
    const $setOnInsert = { ...where, ...insertOnlyData };

    const result = await this.collection.findOneAndUpdate(
      where,
      { $set: updateData, $setOnInsert },
      { upsert: true, returnDocument: "after" },
    );

    return serializeDocument(result);
  }

  private isIncrement(value: unknown): boolean {
    return Boolean(
      value &&
      typeof value === "object" &&
      "increment" in (value as Record<string, unknown>),
    );
  }

  private extractIncrements(data: Record<string, unknown>) {
    const increments: Record<string, number> = {};
    for (const [field, value] of Object.entries(data)) {
      if (this.isIncrement(value)) {
        increments[field] = Number(
          (value as Record<string, unknown>).increment,
        );
      }
    }
    return increments;
  }

  private async applyIncludes(
    docs: Array<Record<string, unknown> | null>,
    include?: Record<string, unknown>,
  ) {
    const rows = docs.filter(Boolean) as Array<Record<string, unknown>>;
    if (!include || rows.length === 0) return rows;

    if (this.model === "comment" && include.replies) {
      await Promise.all(
        rows.map(async (row) => {
          const options = include.replies as QueryArgs;
          const replies = await db.comment.findMany({
            where: { ...(options.where ?? {}), parentId: row.id },
            orderBy: options.orderBy,
            select: options.select,
          });
          row.replies = replies;
        }),
      );
    }

    if (this.model === "comment" && include.blog) {
      await Promise.all(
        rows.map(async (row) => {
          if (!row.blogId) return;
          const options = include.blog as QueryArgs;
          row.blog = await db.blog.findUnique({
            where: { id: row.blogId as string },
            select: options.select,
          });
        }),
      );
    }

    return rows;
  }
}

function createDb() {
  const database = client.db();
  return Object.fromEntries(
    Object.entries(collectionNames).map(([model, collectionName]) => [
      model,
      new MongoModel(
        model as keyof typeof collectionNames,
        database.collection(collectionName),
      ),
    ]),
  ) as Record<keyof typeof collectionNames, MongoModel>;
}

export const db = createDb() as any;
export { client as mongoClient };
