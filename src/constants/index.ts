export const VALID_USERS = [
  {
    id: "1",
    name: "Admin",
    email: "admin@portfolio.com",
    password: "admin123",
    role: "admin" as const,
    avatar: "/images/placeholder-avatar.png"
  },
  {
    id: "2", 
    name: "Luiz Felippe",
    email: "luizfelippeandrade@outlook.com",
    password: "123456",
    role: "admin" as const,
    avatar: "/images/placeholder-avatar.png"
  }
];

export const AUTH_STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user'
} as const;

// ...outras constantes
