/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "./db";
import { dimentions } from "./schema";
import { eq, like } from "drizzle-orm";

export const sizesRepo = {
  findById: async (id) => {
    return db.select().from(dimentions).where(eq(dimentions.id, id));
  },

  findAll: async () => {
    return db.select().from(dimentions);
  },

  create: async (data) => {
    return db.insert(dimentions).values(data);
  },

  update: async (id, data) => {
    return db.update(dimentions).set(data).where(eq(dimentions.id, id));
  },

  delete: async (id) => {
    return db.delete(dimentions).where(eq(dimentions.id, id));
  },

//   searchByName: async (name) => {
//     return db.select().from(warehouses).where(like(warehouses.name, `%${name}%`));
//   },
};