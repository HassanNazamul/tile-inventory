import { mysqlTable, serial, int, varchar, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';
// import { boolean } from 'drizzle-orm/pg-core';

// Users Table
export const users = mysqlTable('users', {
    id: serial().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    // acceptTerms: boolean().default(false).notNull()
});

// Warehouses Table
//old one by Nazrul
// export const warehouses = mysqlTable('warehouses', {
//     id: serial().primaryKey(),
//     name: varchar({ length: 255 }).notNull(),
//     location: varchar({ length: 255 }).notNull(),
//     createdAt: timestamp().defaultNow().notNull(),
//     updatedAt: timestamp().defaultNow().onUpdateNow().notNull(),
// });

// Warehouses Table
//new by Nazmul
export const warehouses = mysqlTable('warehouses', {
    id: serial().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    location: varchar({ length: 255 }).notNull(),
});

// Categories Table
export const categories = mysqlTable('categories', {
    id: serial().primaryKey(),
    name: varchar({ length: 255 }).notNull().unique(),
    createdAt: timestamp().defaultNow().notNull(),
});

// Products Table
export const products = mysqlTable('products', {
    id: serial().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    categoryId: int().notNull(),
    dimensionId: int().notNull(),
    boxQuantity: int().notNull(), // Tiles per box
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().onUpdateNow().notNull(),
});

// Inventory Table
export const inventory = mysqlTable("inventory", {
    id: serial().primaryKey(),
    warehouseId: int().notNull(),
    productId: int().notNull(),
    totalBoxesIn: int().notNull().default(0),  // Default value 0
    totalBoxesOut: int().notNull().default(0), // Default value 0
    updatedAt: timestamp().defaultNow().onUpdateNow().notNull(),
});

// dimention Table
export const dimentions = mysqlTable('dimentions', {
    id: serial().primaryKey(),
    name: varchar({ length: 255 }).notNull().unique(),
    createdAt: timestamp().defaultNow().notNull(),
});


// sales Table
// export const sales = mysqlTable("sales", {
//     id: serial().primaryKey(),
//     inventoryId: int().notNull(),  // Reference to inventory table
//     orderedQty: int().notNull(),   // Quantity ordered
//     buyerName: varchar({ length: 255 }).notNull(),
//     buyerPhone: varchar({ length: 15 }).notNull(),
//     buyerEmail: varchar({ length: 255 }).notNull(),
//     buyerAddress: varchar({ length: 500 }).notNull(),
//     paymentStatus: mysqlEnum(["Pending", "Paid", "Refunded"]).notNull().default("Pending"), 
//     refundStatus: mysqlEnum(["None", "Processing", "Completed"]).notNull().default("None"), 
//     orderStatus: mysqlEnum(["Pending", "Shipped", "Delivered", "Cancelled"]).notNull().default("Pending"), 
//     createdAt: timestamp().defaultNow().notNull(),
//     updatedAt: timestamp().defaultNow().onUpdateNow().notNull(),
// });


export const buyers = mysqlTable("buyers", {
    id: serial().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    phone: varchar({ length: 15 }),  // Unique phone numbers
    email: varchar({ length: 255 }),
    address: varchar({ length: 500 }),
    createdAt: timestamp().defaultNow().notNull(),
});


export const sales = mysqlTable("sales", {
    id: serial().primaryKey(),
    buyerId: int().notNull(),  // Foreign key to buyers
    paymentStatus: mysqlEnum(["Pending", "Paid", "Refunded"]).notNull().default("Pending"),
    refundStatus: mysqlEnum(["None", "Processing", "Completed"]).notNull().default("None"),
    orderStatus: mysqlEnum(["Pending", "Shipped", "Delivered", "Cancelled"]).notNull().default("Pending"),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().onUpdateNow().notNull(),
});


export const orderItems = mysqlTable("order_items", {
    id: serial().primaryKey(),
    saleId: int().notNull(),        // Foreign key to sales
    inventoryId: int().notNull(),   // Foreign key to inventory
    orderedQty: int().notNull(),    // Quantity ordered
    createdAt: timestamp().defaultNow().notNull(),
});