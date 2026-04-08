import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PostPlain = t.Object(
  {
    id: t.Integer(),
    title: t.String(),
    content: __nullable__(t.String()),
    published: t.Boolean(),
    authorId: t.Integer(),
  },
  { additionalProperties: false },
);

export const PostRelations = t.Object(
  {
    author: t.Object(
      { id: t.Integer(), email: t.String(), name: __nullable__(t.String()) },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const PostPlainInputCreate = t.Object(
  {
    title: t.String(),
    content: t.Optional(__nullable__(t.String())),
    published: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const PostPlainInputUpdate = t.Object(
  {
    title: t.Optional(t.String()),
    content: t.Optional(__nullable__(t.String())),
    published: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const PostRelationsInputCreate = t.Object(
  {
    author: t.Object(
      {
        connect: t.Object(
          {
            id: t.Integer({ additionalProperties: false }),
          },
          { additionalProperties: false },
        ),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const PostRelationsInputUpdate = t.Partial(
  t.Object(
    {
      author: t.Object(
        {
          connect: t.Object(
            {
              id: t.Integer({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    },
    { additionalProperties: false },
  ),
);

export const PostWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.Integer(),
          title: t.String(),
          content: t.String(),
          published: t.Boolean(),
          authorId: t.Integer(),
        },
        { additionalProperties: false },
      ),
    { $id: "Post" },
  ),
);

export const PostWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ id: t.Integer() }, { additionalProperties: false }),
          { additionalProperties: false },
        ),
        t.Union([t.Object({ id: t.Integer() })], {
          additionalProperties: false,
        }),
        t.Partial(
          t.Object({
            AND: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            NOT: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            OR: t.Array(Self, { additionalProperties: false }),
          }),
          { additionalProperties: false },
        ),
        t.Partial(
          t.Object(
            {
              id: t.Integer(),
              title: t.String(),
              content: t.String(),
              published: t.Boolean(),
              authorId: t.Integer(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Post" },
);

export const PostSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      title: t.Boolean(),
      content: t.Boolean(),
      published: t.Boolean(),
      author: t.Boolean(),
      authorId: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PostInclude = t.Partial(
  t.Object(
    { author: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const PostOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      title: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      content: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      published: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      authorId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Post = t.Composite([PostPlain, PostRelations], {
  additionalProperties: false,
});

export const PostInputCreate = t.Composite(
  [PostPlainInputCreate, PostRelationsInputCreate],
  { additionalProperties: false },
);

export const PostInputUpdate = t.Composite(
  [PostPlainInputUpdate, PostRelationsInputUpdate],
  { additionalProperties: false },
);
