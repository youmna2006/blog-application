const { EntitySchema } = require("typeorm");

const Post = new EntitySchema({
  name: "Post",
  tableName: "posts",

  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },

    title: {
      type: "varchar",
      length: 200
    },

    content: {
      type: "text"
    },

    createdAt: {
      name: "created_at",
      type: "timestamp",
      createDate: true
    },

    updatedAt: {
      name: "updated_at",
      type: "timestamp",
      updateDate: true
    }
  },

  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      inverseSide: "posts",
      joinColumn: {
        name: "user_id"
      },
      nullable: false,
      onDelete: "CASCADE"
    }
  }
});

module.exports = Post;