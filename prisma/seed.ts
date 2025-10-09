import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpiar datos existentes
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  // Crear tenants
  const tenant1 = await prisma.tenant.create({
    data: { name: 'Tech Solutions' },
  });

  const tenant2 = await prisma.tenant.create({
    data: { name: 'Creative Agency' },
  });

  // Crear usuarios asociados
  const hashedPassword1 = await bcrypt.hash('123456', 10);
  const hashedPassword2 = await bcrypt.hash('abcdef', 10);

  await prisma.user.createMany({
    data: [
      { name: 'Carlos López', tenantId: tenant1.id },
      { name: 'Ana Martínez', tenantId: tenant2.id },
    ],
  });

  console.log('✅ Seed completado con éxito.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });