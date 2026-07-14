import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('123456', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@toolbox.app' },
    update: {},
    create: {
      email: 'demo@toolbox.app',
      name: 'Demo',
      password,
      favorites: {
        create: [
          { toolId: 'calculator', sortOrder: 0 },
          { toolId: 'unit_converter', sortOrder: 1 },
          { toolId: 'json', sortOrder: 2 },
        ],
      },
    },
  });

  console.log(`✅ 初始账号创建成功: demo@toolbox.app / 123456`);
  console.log(`   UID: ${user.id}`);
  console.log(`   已收藏: calculator, unit_converter, json`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
