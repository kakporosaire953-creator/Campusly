/**
 * Contrats Forum — Campusly
 * ---------------------------------------------------------------------------
 * Forum modéré : les contenus sont créés côté serveur avec un statut de
 * modération. En démonstration, les publications restent locales et sont
 * signalées comme telles.
 */

import type { PageQuery, SortQuery } from "./common";
import type { FacultyCode } from "./auth";

export interface ForumAuthor {
  id: string;
  name: string;
  role: "learner" | "teacher" | "admin";
  faculty?: FacultyCode;
  /** Badge affiché à côté du nom (ex. « Enseignant vérifié »). */
  badge?: string;
}

export interface ForumReply {
  id: string;
  author: ForumAuthor;
  content: string;
  createdAt: string;
  likes: number;
  /** Réponse marquée comme résolution du sujet. */
  accepted: boolean;
}

export interface ForumThread {
  id: string;
  title: string;
  content: string;
  author: ForumAuthor;
  faculty?: FacultyCode;
  tags: string[];
  createdAt: string;
  views: number;
  likes: number;
  repliesCount: number;
  solved: boolean;
  /** Fil épinglé par la modération. */
  pinned: boolean;
  replies?: ForumReply[];
}

export interface ForumQuery extends PageQuery, SortQuery {
  search?: string;
  faculty?: FacultyCode;
  tag?: string;
  solved?: boolean;
  sortBy?: "recent" | "popular" | "unanswered";
}

export interface CreateThreadInput {
  title: string;
  content: string;
  faculty?: FacultyCode;
  tags: string[];
}

export interface ForumServiceContract {
  list(query?: ForumQuery): Promise<{ items: ForumThread[]; total: number }>;
  getById(id: string): Promise<ForumThread>;
  createThread(input: CreateThreadInput): Promise<ForumThread>;
  reply(threadId: string, content: string): Promise<ForumReply>;
  toggleLike(threadId: string): Promise<{ liked: boolean; likes: number }>;
  acceptReply(threadId: string, replyId: string): Promise<ForumReply>;
}
