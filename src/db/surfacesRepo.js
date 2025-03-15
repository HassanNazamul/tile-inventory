/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "./db";
import { surfaces } from "./schema";
import { eq, like } from "drizzle-orm";

export const surfacesRepo = {
  findById: async (id) => {
    return db.select().from(surfaces).where(eq(surfaces.id, id));
  },

  findAll: async () => {
    return db.select().from(surfaces);
  },

  create: async (data) => {
    return db.insert(surfaces).values(data);
  },

  update: async (id, data) => {
    return db.update(surfaces).set(data).where(eq(surfaces.id, id));
  },

  delete: async (id) => {
    return db.delete(surfaces).where(eq(surfaces.id, id));
  },

//   searchByName: async (name) => {
//     return db.select().from(warehouses).where(like(warehouses.name, `%${name}%`));
//   },
};