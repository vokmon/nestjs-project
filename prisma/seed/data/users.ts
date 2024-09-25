import { ROLE_ID_ADMIN, ROLE_ID_SYSTEM } from '@src/permissions/roles';

export const systemUser = {
  email: '', // TO BE REPLACED
  password: '',
  firstName: 'System',
  lastName: 'Account',
  roleId: ROLE_ID_SYSTEM,
};

export const adminUser = {
  email: '', // TO BE REPLACED
  password: '',
  firstName: 'Admin',
  lastName: 'Account',
  roleId: ROLE_ID_ADMIN,
};
