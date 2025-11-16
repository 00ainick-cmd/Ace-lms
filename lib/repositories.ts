// Database repositories for Ace LMS
import db from './db';
import { v4 as uuidv4 } from 'uuid';
import type {
  User,
  Course,
  Topic,
  Lesson,
  Enrollment,
  Progress,
  Role,
  EnrollmentStatus,
  ProgressStatus,
  CourseWithTopics,
  TopicWithLessons,
  LessonWithProgress,
  StudentProgress,
} from './types';

// Helper to convert snake_case to camelCase
function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  return Object.keys(obj).reduce((acc: any, key: string) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    acc[camelKey] = toCamelCase(obj[key]);
    return acc;
  }, {});
}

// User Repository
export const userRepository = {
  create(data: { name: string; email: string; password: string; role?: Role }): User {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO users (id, name, email, password, role)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(id, data.name, data.email, data.password, data.role || 'STUDENT');
    return this.findById(id)!;
  },

  findById(id: string): User | null {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const row = stmt.get(id);
    return row ? toCamelCase(row) : null;
  },

  findByEmail(email: string): User | null {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const row = stmt.get(email);
    return row ? toCamelCase(row) : null;
  },

  findAll(): User[] {
    const stmt = db.prepare('SELECT * FROM users ORDER BY created_at DESC');
    return toCamelCase(stmt.all());
  },

  findStudents(): User[] {
    const stmt = db.prepare('SELECT * FROM users WHERE role = ? ORDER BY name');
    return toCamelCase(stmt.all('STUDENT'));
  },
};

// Course Repository
export const courseRepository = {
  create(data: { title: string; description?: string }): Course {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO courses (id, title, description)
      VALUES (?, ?, ?)
    `);
    stmt.run(id, data.title, data.description || null);
    return this.findById(id)!;
  },

  findById(id: string): Course | null {
    const stmt = db.prepare('SELECT * FROM courses WHERE id = ?');
    const row = stmt.get(id);
    return row ? toCamelCase(row) : null;
  },

  findAll(): Course[] {
    const stmt = db.prepare('SELECT * FROM courses ORDER BY created_at DESC');
    return toCamelCase(stmt.all());
  },

  findWithTopics(courseId: string): CourseWithTopics | null {
    const course = this.findById(courseId);
    if (!course) return null;

    const topics = topicRepository.findByCourseId(courseId);
    const topicsWithLessons: TopicWithLessons[] = topics.map((topic) => ({
      ...topic,
      lessons: lessonRepository.findByTopicId(topic.id),
    }));

    return {
      ...course,
      topics: topicsWithLessons,
    };
  },
};

// Topic Repository
export const topicRepository = {
  create(data: { courseId: string; title: string; description?: string; order: number }): Topic {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO topics (id, course_id, title, description, "order")
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(id, data.courseId, data.title, data.description || null, data.order);
    return this.findById(id)!;
  },

  findById(id: string): Topic | null {
    const stmt = db.prepare('SELECT * FROM topics WHERE id = ?');
    const row = stmt.get(id);
    return row ? toCamelCase(row) : null;
  },

  findByCourseId(courseId: string): Topic[] {
    const stmt = db.prepare('SELECT * FROM topics WHERE course_id = ? ORDER BY "order"');
    return toCamelCase(stmt.all(courseId));
  },
};

// Lesson Repository
export const lessonRepository = {
  create(data: { topicId: string; title: string; githubUrl: string; order: number }): Lesson {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO lessons (id, topic_id, title, github_url, "order")
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(id, data.topicId, data.title, data.githubUrl, data.order);
    return this.findById(id)!;
  },

  findById(id: string): Lesson | null {
    const stmt = db.prepare('SELECT * FROM lessons WHERE id = ?');
    const row = stmt.get(id);
    return row ? toCamelCase(row) : null;
  },

  findByTopicId(topicId: string): Lesson[] {
    const stmt = db.prepare('SELECT * FROM lessons WHERE topic_id = ? ORDER BY "order"');
    return toCamelCase(stmt.all(topicId));
  },

  findWithProgress(lessonId: string, userId: string): LessonWithProgress | null {
    const lesson = this.findById(lessonId);
    if (!lesson) return null;

    const progress = progressRepository.findByUserAndLesson(userId, lessonId);
    return {
      ...lesson,
      progress: progress || undefined,
    };
  },
};

// Enrollment Repository
export const enrollmentRepository = {
  create(data: { userId: string; courseId: string; status?: EnrollmentStatus }): Enrollment {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO enrollments (id, user_id, course_id, status)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(id, data.userId, data.courseId, data.status || 'ACTIVE');
    return this.findById(id)!;
  },

  findById(id: string): Enrollment | null {
    const stmt = db.prepare('SELECT * FROM enrollments WHERE id = ?');
    const row = stmt.get(id);
    return row ? toCamelCase(row) : null;
  },

  findByUserId(userId: string): Enrollment[] {
    const stmt = db.prepare('SELECT * FROM enrollments WHERE user_id = ?');
    return toCamelCase(stmt.all(userId));
  },

  findByUserAndCourse(userId: string, courseId: string): Enrollment | null {
    const stmt = db.prepare('SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?');
    const row = stmt.get(userId, courseId);
    return row ? toCamelCase(row) : null;
  },

  enrollIfNotExists(userId: string, courseId: string): Enrollment {
    const existing = this.findByUserAndCourse(userId, courseId);
    if (existing) return existing;
    return this.create({ userId, courseId });
  },
};

// Progress Repository
export const progressRepository = {
  create(data: {
    userId: string;
    lessonId: string;
    status?: ProgressStatus;
    startedAt?: string;
    completedAt?: string;
    lastVisitedAt?: string;
  }): Progress {
    const id = uuidv4();
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO progress (id, user_id, lesson_id, status, started_at, completed_at, last_visited_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.userId,
      data.lessonId,
      data.status || 'NOT_STARTED',
      data.startedAt || null,
      data.completedAt || null,
      data.lastVisitedAt || now
    );
    return this.findById(id)!;
  },

  findById(id: string): Progress | null {
    const stmt = db.prepare('SELECT * FROM progress WHERE id = ?');
    const row = stmt.get(id);
    return row ? toCamelCase(row) : null;
  },

  findByUserId(userId: string): Progress[] {
    const stmt = db.prepare('SELECT * FROM progress WHERE user_id = ?');
    return toCamelCase(stmt.all(userId));
  },

  findByUserAndLesson(userId: string, lessonId: string): Progress | null {
    const stmt = db.prepare('SELECT * FROM progress WHERE user_id = ? AND lesson_id = ?');
    const row = stmt.get(userId, lessonId);
    return row ? toCamelCase(row) : null;
  },

  updateStatus(userId: string, lessonId: string, status: ProgressStatus): Progress {
    const existing = this.findByUserAndLesson(userId, lessonId);
    const now = new Date().toISOString();

    if (!existing) {
      // Create new progress record
      const data: any = { userId, lessonId, status, lastVisitedAt: now };
      if (status === 'IN_PROGRESS') data.startedAt = now;
      if (status === 'COMPLETED') {
        data.startedAt = now;
        data.completedAt = now;
      }
      return this.create(data);
    }

    // Update existing record
    const updates: any = {
      status,
      lastVisitedAt: now,
      updatedAt: now,
    };

    if (status === 'IN_PROGRESS' && !existing.startedAt) {
      updates.startedAt = now;
    }
    if (status === 'COMPLETED' && !existing.completedAt) {
      updates.completedAt = now;
      if (!existing.startedAt) {
        updates.startedAt = now;
      }
    }

    const setClause = Object.keys(updates).map((key) => {
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      return `${dbKey} = ?`;
    }).join(', ');

    const stmt = db.prepare(`
      UPDATE progress
      SET ${setClause}
      WHERE user_id = ? AND lesson_id = ?
    `);

    stmt.run(...Object.values(updates), userId, lessonId);
    return this.findByUserAndLesson(userId, lessonId)!;
  },

  getProgressSummary(userId: string, courseId: string) {
    // Get all lessons for the course
    const stmt = db.prepare(`
      SELECT l.id
      FROM lessons l
      JOIN topics t ON l.topic_id = t.id
      WHERE t.course_id = ?
    `);
    const allLessons = stmt.all(courseId);
    const totalLessons = allLessons.length;

    // Get progress for user
    const progressStmt = db.prepare(`
      SELECT p.status, COUNT(*) as count
      FROM progress p
      JOIN lessons l ON p.lesson_id = l.id
      JOIN topics t ON l.topic_id = t.id
      WHERE p.user_id = ? AND t.course_id = ?
      GROUP BY p.status
    `);
    const progressRows = progressStmt.all(userId, courseId) as any[];

    const completed = progressRows.find((r) => r.status === 'COMPLETED')?.count || 0;
    const inProgress = progressRows.find((r) => r.status === 'IN_PROGRESS')?.count || 0;
    const notStarted = totalLessons - completed - inProgress;

    return {
      totalLessons,
      completedLessons: completed,
      inProgressLessons: inProgress,
      notStartedLessons: notStarted,
      percentage: totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0,
    };
  },
};
