import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  emoji: varchar("emoji", { length: 16 }).notNull().default("📦"),
  description: text("description").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  mime: varchar("mime", { length: 80 }).notNull(),
  data: text("data").notNull(), // base64
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 140 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  description: text("description").notNull().default(""),
  // precio en centavos
  price: integer("price").notNull().default(0),
  compareAtPrice: integer("compare_at_price"),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull().default(""),
  stock: integer("stock").notNull().default(0),
  active: boolean("active").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  customerName: varchar("customer_name", { length: 160 }).notNull(),
  email: varchar("email", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 60 }).notNull().default(""),
  city: varchar("city", { length: 160 }).notNull().default(""),
  notes: text("notes").notNull().default(""),
  // Total estimado con los precios de lista al momento de solicitar
  estimatedTotal: integer("estimated_total").notNull().default(0),
  couponCode: varchar("coupon_code", { length: 40 }).notNull().default(""),
  // nueva | contactado | cotizado | aceptada | cerrada | cancelada
  status: varchar("status", { length: 30 }).notNull().default("nueva"),
  sentToWhatsapp: boolean("sent_to_whatsapp").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 40 }).notNull().unique(),
  kind: varchar("kind", { length: 12 }).notNull().default("percent"), // percent | fixed
  value: integer("value").notNull().default(0), // % o centavos
  minTotal: integer("min_total").notNull().default(0),
  active: boolean("active").notNull().default(true),
  usedCount: integer("used_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const quoteItems = pgTable("quote_items", {
  id: serial("id").primaryKey(),
  quoteId: integer("quote_id")
    .notNull()
    .references(() => quotes.id, { onDelete: "cascade" }),
  productId: integer("product_id"),
  name: varchar("name", { length: 200 }).notNull(),
  unitPrice: integer("unit_price").notNull(),
  quantity: integer("quantity").notNull(),
});

export const settings = pgTable("settings", {
  key: varchar("key", { length: 60 }).primaryKey(),
  value: text("value").notNull().default(""),
});

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Quote = typeof quotes.$inferSelect;
export type QuoteItem = typeof quoteItems.$inferSelect;
export type Coupon = typeof coupons.$inferSelect;
