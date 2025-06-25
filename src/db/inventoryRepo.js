/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "./db";
import { inventory } from "@db/schema";
import { eq, like } from "drizzle-orm";

export const inventoryRepo = {
  findById: async (id) => {
    return db.select().from(inventory).where(eq(inventory.id, id));
  },

  findAll: async () => {
    return db.select().from(inventory);
  },

  create: async (data) => {
    return db.insert(inventory).values(data);
  },

  update: async (id, data) => {
    return db.update(inventory).set(data).where(eq(inventory.id, id));
  },

  delete: async (id) => {
    return db.delete(inventory).where(eq(inventory.id, id));
  },

//   searchByName: async (name) => {
//     return db.select().from(warehouses).where(like(warehouses.name, `%${name}%`));
//   },
};