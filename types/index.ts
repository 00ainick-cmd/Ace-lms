// Database types extended from Prisma
export type UserRole = 'student' | 'admin';
export type SubscriptionType = 'free' | 'basic' | 'professional' | 'enterprise';
export type BadgeCategory = 'completion' | 'streak' | 'skill' | 'achievement';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  companyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  subscriptionType: SubscriptionType;
  seatLimit: number;
  activeSince: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  category: string;
  githubPath: string;
  orderIndex: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  githubPath: string;
  orderIndex: number;
  estimatedMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProgress {
  id: string;
  userId: string;
  moduleId: string;
  completionPercentage: number;
  lastAccessed: Date;
  timeSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description?: string;
  pointValue: number;
  category: BadgeCategory;
  iconClass: string;
  requirement?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: Date;
  pointsEarned: number;
}

export interface AssessmentQuestion {
  id: number;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  question: string;
  options?: string[];
  correctAnswer: number | string | boolean;
}

export interface Assessment {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  questions: AssessmentQuestion[];
  passingScore: number;
  timeLimit?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAssessmentAnswer {
  questionId: number;
  answer: number | string | boolean;
}

export interface UserAssessment {
  id: string;
  userId: string;
  assessmentId: string;
  score: number;
  attempts: number;
  passed: boolean;
  answers?: UserAssessmentAnswer[];
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Extended types with relations
export interface CourseWithModules extends Course {
  modules: Module[];
}

export interface ModuleWithProgress extends Module {
  progress?: UserProgress;
  assessment?: Assessment;
}

export interface UserWithProgress extends User {
  progress: UserProgress[];
  badges: UserBadge[];
  assessments: UserAssessment[];
}

export interface DashboardStats {
  totalCourses: number;
  completedModules: number;
  totalModules: number;
  totalPoints: number;
  badgesEarned: number;
  averageScore: number;
}
