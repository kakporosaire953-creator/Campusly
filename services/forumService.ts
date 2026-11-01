/**
 * forumService — SIMULATION frontend
 * Les sujets et réponses créés restent locaux (localStorage). Aucune
 * modération réelle n'a lieu.
 * Endpoints futurs : GET /api/forum/threads, GET /api/forum/threads/:id,
 * POST /api/forum/threads, POST /api/forum/threads/:id/replies,
 * POST /api/forum/threads/:id/like.
 */

import type {
  CreateThreadInput,
  ForumQuery,
  ForumReply,
  ForumServiceContract,
  ForumThread,
} from "@/types";
import { ApiError } from "./api/client";
import { DEMO_THREADS } from "./mocks/fixtures/forum";
import { demoDelay, demoStore, nowIso, uid } from "./mocks/store";

const THREADS_KEY = "forum-threads";
const LIKES_KEY = "forum-likes";

const CURRENT_AUTHOR = {
  id: "demo-user-learner",
  name: "Rosaire Kakpo (démo)",
  role: "learner" as const,
  faculty: "FAST" as const,
};

class ForumService implements ForumServiceContract {
  private all(): ForumThread[] {
    const created = demoStore.read<ForumThread[]>(THREADS_KEY, []);
    return [...created, ...DEMO_THREADS];
  }

  async list(query: ForumQuery = {}): Promise<{ items: ForumThread[]; total: number }> {
    await demoDelay();
    let items = this.all();

    if (query.search) {
      const needle = query.search.toLowerCase();
      items = items.filter(
        (thread) =>
          thread.title.toLowerCase().includes(needle) ||
          thread.content.toLowerCase().includes(needle) ||
          thread.tags.some((tag) => tag.toLowerCase().includes(needle)),
      );
    }
    if (query.faculty) items = items.filter((thread) => thread.faculty === query.faculty);
    if (query.tag) items = items.filter((thread) => thread.tags.includes(query.tag!));
    if (typeof query.solved === "boolean") items = items.filter((thread) => thread.solved === query.solved);

    const sortBy = query.sortBy ?? "recent";
    items = [...items].sort((a, b) => {
      if (sortBy === "popular") return b.views + b.likes - (a.views + a.likes);
      if (sortBy === "unanswered") return a.repliesCount - b.repliesCount;
      return b.createdAt.localeCompare(a.createdAt);
    });

    const total = items.length;
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    return { items: items.slice((page - 1) * pageSize, page * pageSize), total };
  }

  async getById(id: string): Promise<ForumThread> {
    await demoDelay(90);
    const thread = this.all().find((item) => item.id === id);
    if (!thread) throw ApiError.of("NOT_FOUND", "Sujet introuvable.");
    return thread;
  }

  async createThread(input: CreateThreadInput): Promise<ForumThread> {
    await demoDelay(320);
    const fields: Record<string, string> = {};
    if (input.title.trim().length < 8) fields.title = "Le titre doit contenir au moins 8 caractères";
    if (input.content.trim().length < 20) fields.content = "Décrivez votre question en 20 caractères minimum";
    if (Object.keys(fields).length > 0) {
      throw ApiError.of("VALIDATION", "Le sujet est incomplet.", fields);
    }

    const thread: ForumThread = {
      id: uid("thread"),
      title: input.title.trim(),
      content: input.content.trim(),
      author: CURRENT_AUTHOR,
      faculty: input.faculty,
      tags: input.tags,
      createdAt: nowIso(),
      views: 0,
      likes: 0,
      repliesCount: 0,
      solved: false,
      pinned: false,
      replies: [],
    };

    demoStore.write(THREADS_KEY, [thread, ...demoStore.read<ForumThread[]>(THREADS_KEY, [])]);
    return thread;
  }

  async reply(threadId: string, content: string): Promise<ForumReply> {
    await demoDelay(220);
    if (content.trim().length < 3) {
      throw ApiError.of("VALIDATION", "La réponse est trop courte.");
    }
    const reply: ForumReply = {
      id: uid("reply"),
      author: CURRENT_AUTHOR,
      content: content.trim(),
      createdAt: nowIso(),
      likes: 0,
      accepted: false,
    };
    this.persistReply(threadId, reply);
    return reply;
  }

  async toggleLike(threadId: string): Promise<{ liked: boolean; likes: number }> {
    await demoDelay(60);
    const liked = demoStore.read<string[]>(LIKES_KEY, []);
    const isLiked = liked.includes(threadId);
    demoStore.write(LIKES_KEY, isLiked ? liked.filter((id) => id !== threadId) : [...liked, threadId]);
    const thread = await this.getById(threadId);
    return { liked: !isLiked, likes: thread.likes + (isLiked ? -1 : 1) };
  }

  async acceptReply(threadId: string, replyId: string): Promise<ForumReply> {
    await demoDelay(140);
    const thread = await this.getById(threadId);
    const reply = thread.replies?.find((item) => item.id === replyId);
    if (!reply) throw ApiError.of("NOT_FOUND", "Réponse introuvable.");
    return { ...reply, accepted: true };
  }

  likedIds(): string[] {
    return demoStore.read<string[]>(LIKES_KEY, []);
  }

  /** Les réponses locales sont stockées dans un sujet « miroir ». */
  private persistReply(threadId: string, reply: ForumReply): void {
    const created = demoStore.read<ForumThread[]>(THREADS_KEY, []);
    const index = created.findIndex((thread) => thread.id === threadId);
    if (index >= 0) {
      const updated = [...created];
      const thread = updated[index];
      updated[index] = {
        ...thread,
        replies: [...(thread.replies ?? []), reply],
        repliesCount: thread.repliesCount + 1,
      };
      demoStore.write(THREADS_KEY, updated);
      return;
    }
    // Sujet de démonstration : on conserve les réponses locales séparément.
    const overrides = demoStore.read<Record<string, ForumReply[]>>("forum-replies", {});
    demoStore.write("forum-replies", { ...overrides, [threadId]: [reply, ...(overrides[threadId] ?? [])] });
  }

  localReplies(threadId: string): ForumReply[] {
    return demoStore.read<Record<string, ForumReply[]>>("forum-replies", {})[threadId] ?? [];
  }
}

export const forumService = new ForumService();
