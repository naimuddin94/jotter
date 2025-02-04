export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export const USER_ROLE = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export const USER_PLAN = {
  BASIC: 'BASIC',
  PREMIUM: 'PREMIUM',
  ENTERPRISE: 'ENTERPRISE',
} as const;

export type TStatus = keyof typeof USER_STATUS;
export type TRole = keyof typeof USER_ROLE;
export type TPlan = keyof typeof USER_PLAN;
