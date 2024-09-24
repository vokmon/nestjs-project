import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';
import { adminUser, systemUser } from './data/users';

const prisma = new PrismaClient();

async function main() {
  const id = 'Seeding';
  console.time(id);
  console.log('Start seeding ....');

  console.log('\t- Add users');
  const users = [systemUser, adminUser];
  for (const user of users) {
    const hash = await argon.hash(user.password, {
      secret: Buffer.from(process.env.AUTH_SECRET, 'utf-8'),
    });
    await prisma.user.create({
      data: {
        email: user.email,
        password: hash,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
      },
    });
  }

  console.log('Finish seeding ....');
  console.timeEnd(id);
}

main();
