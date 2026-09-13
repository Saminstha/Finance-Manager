export const endpoints = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    refresh: "/auth/refresh",
  },
  users: {
    me: "/users/me",
  },

  accounts: {
    all: "/accounts",
  },

  transactions: {
    all: "/transactions",
    report: "/transactions/report",
  },

  budgets: {
    all: "/budgets",
  },

  savings: {
    all: "/savings",
  },

  dashboard: {
    summary: "/dashboard/summary",
  },
} as const;
