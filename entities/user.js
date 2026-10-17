const { EntitySchema } = require("typeorm");

const User = new EntitySchema({
  name: "User",
  tableName: "users",

  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },

    username: {
      type: "varchar",
      length: 50,
      unique: true
    },

    email: {
      type: "varchar",
      length: 255,
      unique: true
    },

    password: {
      type: "varchar",
      select: false
    },

    role: {
      type: "varchar",
      default: "user"
    },

    createdAt: {
      name: "created_at",
      type: "timestamp",
      createDate: true
    }
  },

  relations: {
    posts: {
      type: "one-to-many",
      target: "Post",
      inverseSide: "user"
    }
  }
});

module.exports = User;