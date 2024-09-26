import {
  ACTION_ALL,
  ACTION_BOOKMARK_READ,
  ACTION_BOOKMARK_READ_ALL,
  ACTION_BOOKMARK_WRITE,
  ACTION_BOOKMARK_WRITE_ALL,
  ACTION_USER_READ,
  ACTION_USER_WRITE,
} from './actions';

export const ROLE_ID_SYSTEM = '0';
export const ROLE_ID_ADMIN = '1';
export const ROLE_ID_USER = '2';

export const ROLE_SYSTEM = {
  id: ROLE_ID_SYSTEM,
  name: 'System',
  description: 'System User',
  actionsIds: [ACTION_ALL.id],
};

export const ROLE_ADMIN = {
  id: ROLE_ID_ADMIN,
  name: 'Admin',
  description: 'Admin User',
  actionsIds: [
    ACTION_USER_READ.id,
    ACTION_USER_WRITE.id,
    ACTION_BOOKMARK_READ_ALL.id,
    ACTION_BOOKMARK_WRITE_ALL.id,
  ],
};

export const ROLE_USER = {
  id: ROLE_ID_USER,
  name: 'User',
  description: 'Normal user with permissions',
  actionsIds: [ACTION_BOOKMARK_READ.id, ACTION_BOOKMARK_WRITE.id],
};

export const ALL_ROLES = [ROLE_SYSTEM, ROLE_ADMIN, ROLE_USER];
