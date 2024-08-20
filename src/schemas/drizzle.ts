import { relations } from "drizzle-orm";
import {
  pgEnum,
  pgSchema,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  integer,
} from "drizzle-orm/pg-core";

export const UserSystemEnum = pgEnum("user_system_enum", ["assistant", "user"]);

const authSchema = pgSchema("auth");

export const Users = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const Profiles = pgTable("profiles", {
  id: uuid("id")
    .primaryKey()
    .references(() => Users.id, { onDelete: "cascade" }),
  name: text("name"),
  profilePicture: text("profile_picture"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const ProfilesRelation = relations(Profiles, ({ one, many }) => ({
  chats: many(Chats),
}));

export const Chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  pdfName: text("pdf_name").notNull(),
  pdfUrl: text("pdf_url").notNull(),
  pineconeNamespace: text("pinecone_namespace").notNull(),
  userId: uuid("user_id")
    .references(() => Profiles.id, {
      onDelete: "cascade",
    })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ChatsRelation = relations(Chats, ({ one, many }) => ({
  user: one(Profiles, { fields: [Chats.userId], references: [Profiles.id] }),
  messages: many(Messages),
}));

export const Messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id")
    .references(() => Chats.id, {
      onDelete: "cascade",
    })
    .notNull(),
  content: text("content").notNull(),
  role: UserSystemEnum("role").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const MessagesRelation = relations(Messages, ({ one, many }) => ({
  chat: one(Chats, { fields: [Messages.chatId], references: [Chats.id] }),
}));
