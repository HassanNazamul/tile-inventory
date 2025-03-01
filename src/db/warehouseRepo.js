/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "./db";
import { warehouses } from "./schema";
import { eq, like } from "drizzle-orm";

export const warehouseRepo = {
  findById: async (id) => {
    return db.select().from(warehouses).where(eq(warehouses.id, id));
  },

  findAll: async () => {
    return db.select().from(warehouses);
  },

  create: async (data) => {
    return db.insert(warehouses).values(data);
  },

  update: async (id, data) => {
    return db.update(warehouses).set(data).where(eq(warehouses.id, id));
  },

  delete: async (id) => {
    return db.delete(warehouses).where(eq(warehouses.id, id));
  },

//   searchByName: async (name) => {
//     return db.select().from(warehouses).where(like(warehouses.name, `%${name}%`));
//   },
};