import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';
import { adminUser, systemUser } from './data/users';
import { ALL_ACTIONS } from '@src/permissions/actions';
import { ALL_ROLES } from '@src/permissions/roles';

const prisma = new PrismaClient();

async function main() {
  const id = 'Seeding';
  console.time(id);
  console.log('Start seeding ....');

  await addActions();
  await addRoles();
  await addUsers();

  console.log('Finish seeding ....');
  console.timeEnd(id);
}

async function addActions() {
  console.log('\t- Add actions');
  for (const action of ALL_ACTIONS) {
    await prisma.action.create({
      data: action,
    });
  }
}

async function addRoles() {
  console.log('\t- Add Roles');
  for (const role of ALL_ROLES) {
    await prisma.role.create({
      data: role,
    });
  }
}

async function addUsers() {
  console.log('\t- Add users');
  const users = [];

  users.push(
    await shouldIncludeUser(
      process.env.INITIAL_SYSTEM_USER,
      process.env.INITIAL_SYSTEM_PASSWORD,
      adminUser,
    ),
  );

  users.push(
    await shouldIncludeUser(
      process.env.INITIAL_ADMIN_USER,
      process.env.INITIAL_ADMIN_PASSWORD,
      systemUser,
    ),
  );

  for (const user of users) {
    if (user) {
      await prisma.user.create({
        data: {
          email: user.email,
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName,
          roleId: user.roleId,
        },
      });
    }
  }
}

async function shouldIncludeUser(
  username: string,
  password: string,
  userData: any,
) {
  if (username && password) {
    const hash = await argon.hash(password, {
      secret: Buffer.from(process.env.AUTH_SECRET, 'utf-8'),
    });
    const user = {
      ...userData,
      email: username,
      password: hash,
    };
    return user;
  }
}

main();
