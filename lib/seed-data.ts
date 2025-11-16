// Seed data for demo/dev purposes only
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
}

export const SEED_STUDENT: User = {
  id: 'student-001',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  role: 'student',
};

export const SEED_ADMIN: User = {
  id: 'admin-001',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  role: 'admin',
};

export const SEED_USERS = {
  student: SEED_STUDENT,
  admin: SEED_ADMIN,
};
