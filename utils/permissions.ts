
import { UserRole } from '../types';

export type Action = 'VIEW' | 'CREATE' | 'EDIT' | 'DELETE' | 'APPROVE';
export type Entity = 'CASE' | 'AGREEMENT' | 'FINANCIALS' | 'AUDIT' | 'SETTINGS';

const PERMISSIONS: Record<UserRole, Partial<Record<Entity, Action[]>>> = {
  [UserRole.ADMIN]: {
    CASE: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
    AGREEMENT: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'APPROVE'],
    FINANCIALS: ['VIEW'],
    AUDIT: ['VIEW'],
    SETTINGS: ['VIEW'],
  },
  [UserRole.SUPERVISOR]: {
    CASE: ['VIEW', 'CREATE', 'EDIT'],
    AGREEMENT: ['VIEW', 'EDIT', 'APPROVE'],
    FINANCIALS: ['VIEW'],
    AUDIT: ['VIEW'],
    SETTINGS: [],
  },
  [UserRole.MANAGEMENT]: {
    CASE: ['VIEW'],
    AGREEMENT: ['VIEW', 'APPROVE'],
    FINANCIALS: ['VIEW'],
    AUDIT: ['VIEW'],
    SETTINGS: [],
  },
  [UserRole.LEGAL_OFFICER]: {
    CASE: ['VIEW', 'CREATE', 'EDIT'],
    AGREEMENT: ['VIEW', 'CREATE', 'EDIT'],
    FINANCIALS: [],
    AUDIT: [],
    SETTINGS: [],
  },
  [UserRole.VIEWER]: {
    CASE: ['VIEW'],
    AGREEMENT: ['VIEW'],
    FINANCIALS: [],
    AUDIT: [],
    SETTINGS: [],
  },
};

export const hasPermission = (role: UserRole, entity: Entity, action: Action): boolean => {
  const permissions = PERMISSIONS[role][entity];
  return permissions ? permissions.includes(action) : false;
};
