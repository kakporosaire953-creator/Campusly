/**
 * classroomService — SIMULATION frontend
 * ---------------------------------------------------------------------------
 * Les classrooms créées ou rejointes restent dans le navigateur. Aucun membre
 * n'est réellement invité, aucune ressource n'est stockée sur R2.
 *
 * Endpoints futurs : GET /api/classrooms, GET /api/classrooms/:id,
 * POST /api/classrooms, POST /api/classrooms/join, POST /api/classrooms/:id/posts.
 */

import type {
  Classroom,
  ClassroomAnalytics,
  ClassroomPost,
  ClassroomServiceContract,
  CreateClassroomInput,
  JoinClassroomInput,
} from "@/types";
import { ApiError } from "./api/client";
import { DEMO_CLASSROOMS } from "./mocks/fixtures/classrooms";
import { demoDelay, demoStore, nowIso, uid } from "./mocks/store";

const CREATED_KEY = "classrooms-created";
const JOINED_KEY = "classrooms-joined";
const POSTS_KEY = "classroom-posts";

function slugCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

class ClassroomService implements ClassroomServiceContract {
  private all(): Classroom[] {
    const created = demoStore.read<Classroom[]>(CREATED_KEY, []);
    return [...created, ...DEMO_CLASSROOMS];
  }

  async list(): Promise<Classroom[]> {
    await demoDelay();
    return this.all();
  }

  async getById(id: string): Promise<Classroom> {
    await demoDelay(90);
    const classroom = this.all().find((item) => item.id === id);
    if (!classroom) {
      throw ApiError.of("NOT_FOUND", "Cette classroom n'existe pas (données de démonstration).");
    }
    const extraPosts = demoStore.read<Record<string, ClassroomPost[]>>(POSTS_KEY, {})[id] ?? [];
    return { ...classroom, posts: [...extraPosts, ...(classroom.posts ?? [])] };
  }

  async analytics(id: string): Promise<ClassroomAnalytics> {
    await demoDelay(120);
    const classroom = await this.getById(id);
    const totalStudents = classroom.studentsCount;
    const average = classroom.average;
    const strugglingCount = Math.max(1, Math.round(totalStudents * 0.09));
    const buckets = [
      { bucket: "0 – 5", count: Math.round(totalStudents * 0.04) },
      { bucket: "5 – 10", count: Math.round(totalStudents * 0.18) },
      { bucket: "10 – 14", count: Math.round(totalStudents * 0.46) },
      { bucket: "14 – 17", count: Math.round(totalStudents * 0.24) },
      { bucket: "17 – 20", count: Math.round(totalStudents * 0.08) },
    ];
    return {
      totalStudents,
      classAverage: average,
      participationRate: Math.min(98, Math.round(78 + (totalStudents % 15))),
      strugglingCount,
      distribution: buckets,
    };
  }

  async create(input: CreateClassroomInput): Promise<Classroom> {
    await demoDelay(360);
    const fields: Record<string, string> = {};
    if (!input.name?.trim()) fields.name = "Nom de la classroom obligatoire";
    if (!input.subject?.trim()) fields.subject = "Matière obligatoire";
    if (Object.keys(fields).length > 0) {
      throw ApiError.of("VALIDATION", "Le formulaire est incomplet.", fields);
    }

    const classroom: Classroom = {
      id: uid("cls"),
      code: slugCode(),
      name: input.name.trim(),
      subject: input.subject.trim(),
      faculty: input.faculty,
      level: input.level,
      teacherName: "Dr. Komlan Agboton (démo)",
      description: input.description?.trim() || "Classroom créée en mode démonstration.",
      studentsCount: 1,
      average: null,
      color: "#1565C0",
      createdAt: nowIso(),
      members: [],
      resources: [],
      assignments: [],
      posts: [
        {
          id: uid("post"),
          authorName: "Dr. Komlan Agboton (démo)",
          authorRole: "owner",
          content: `Bienvenue dans la classe ${input.name.trim()}. Les ressources et annonces seront publiées ici.`,
          createdAt: nowIso(),
          pinned: true,
          commentsCount: 0,
        },
      ],
    };

    demoStore.write(CREATED_KEY, [classroom, ...demoStore.read<Classroom[]>(CREATED_KEY, [])]);
    return classroom;
  }

  async join(input: JoinClassroomInput): Promise<Classroom> {
    await demoDelay(280);
    const code = input.code.trim().toUpperCase();
    if (code.length < 5) {
      throw ApiError.of("VALIDATION", "Le code d'invitation comporte au moins 5 caractères.", {
        code: "Code trop court",
      });
    }
    const classroom = this.all().find((item) => item.code.toUpperCase() === code);
    if (!classroom) {
      throw ApiError.of("NOT_FOUND", "Aucune classroom de démonstration ne correspond à ce code.");
    }
    const joined = demoStore.read<string[]>(JOINED_KEY, []);
    demoStore.write(JOINED_KEY, Array.from(new Set([...joined, classroom.id])));
    return classroom;
  }

  async leave(id: string): Promise<void> {
    await demoDelay(150);
    const joined = demoStore.read<string[]>(JOINED_KEY, []);
    demoStore.write(
      JOINED_KEY,
      joined.filter((item) => item !== id),
    );
  }

  async addPost(classroomId: string, content: string): Promise<ClassroomPost> {
    await demoDelay(240);
    if (!content.trim()) {
      throw ApiError.of("VALIDATION", "Le message ne peut pas être vide.");
    }
    const post: ClassroomPost = {
      id: uid("post"),
      authorName: "Vous (démonstration)",
      authorRole: "member",
      content: content.trim(),
      createdAt: nowIso(),
      pinned: false,
      commentsCount: 0,
    };
    const allPosts = demoStore.read<Record<string, ClassroomPost[]>>(POSTS_KEY, {});
    demoStore.write(POSTS_KEY, {
      ...allPosts,
      [classroomId]: [post, ...(allPosts[classroomId] ?? [])],
    });
    return post;
  }

  joinedIds(): string[] {
    return demoStore.read<string[]>(JOINED_KEY, []);
  }
}

export const classroomService = new ClassroomService();
