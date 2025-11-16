// Type definitions for Ace LMS

export type Role = 'STUDENT' | 'ADMIN';

export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'INACTIVE';

export type ProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  topicId: string;
  title: string;
  githubUrl: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Progress {
  id: string;
  userId: string;
  lessonId: string;
  status: ProgressStatus;
  startedAt: string | null;
  completedAt: string | null;
  lastVisitedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Extended types with relations
export interface TopicWithLessons extends Topic {
  lessons: Lesson[];
}

export interface CourseWithTopics extends Course {
  topics: TopicWithLessons[];
}

export interface LessonWithProgress extends Lesson {
  progress?: Progress;
}

export interface TopicWithProgress extends Topic {
  lessons: LessonWithProgress[];
  completedCount: number;
  totalCount: number;
}

export interface StudentProgress {
  user: User;
  courseProgress: {
    courseId: string;
    totalLessons: number;
    completedLessons: number;
    inProgressLessons: number;
    lastActivity: string | null;
  }[];
}
