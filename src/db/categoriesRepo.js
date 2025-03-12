/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "./db";
import { categories } from "./schema";
import { eq, like } from "drizzle-orm";

export const categoriesRepo = {
  findById: async (id) => {
    return db.select().from(categories).where(eq(categories.id, id));
  },

  findAll: async () => {
    return db.select().from(categories);
  },

  create: async (data) => {
    return db.insert(categories).values(data);
  },

  update: async (id, data) => {
    return db.update(categories).set(data).where(eq(categories.id, id));
  },

  delete: async (id) => {
    return db.delete(categories).where(eq(categories.id, id));
  },

//   searchByName: async (name) => {
//     return db.select().from(warehouses).where(like(warehouses.name, `%${name}%`));
//   },
};