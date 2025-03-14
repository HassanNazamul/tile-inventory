/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "./db";
import { products } from "./schema";
import { eq, like } from "drizzle-orm";

export const productsRepo = {
  findById: async (id) => {
    return db.select().from(products).where(eq(products.id, id));
  },

  findAll: async () => {
    return db.select().from(products);
  },

  create: async (data) => {
    return db.insert(products).values(data);
  },

  update: async (id, data) => {
    return db.update(products).set(data).where(eq(products.id, id));
  },

  delete: async (id) => {
    return db.delete(products).where(eq(products.id, id));
  },

//   searchByName: async (name) => {
//     return db.select().from(warehouses).where(like(warehouses.name, `%${name}%`));
//   },
};