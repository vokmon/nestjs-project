import { ROLE_ID_ADMIN, ROLE_ID_SYSTEM } from '@src/permissions/roles';

export const USER_ID_SYSTEM = '0';
export const USER_ID_ADMIN = '1';

export const systemUser = {
  id: USER_ID_SYSTEM,
  email: '', // TO BE REPLACED
  password: '',
  firstName: 'System',
  lastName: 'Account',
  roleId: ROLE_ID_SYSTEM,
};

export const adminUser = {
  id: USER_ID_ADMIN,
  email: '', // TO BE REPLACED
  password: '',
  firstName: 'Admin',
  lastName: 'Account',
  roleId: ROLE_ID_ADMIN,
  createdById: USER_ID_SYSTEM,
};
