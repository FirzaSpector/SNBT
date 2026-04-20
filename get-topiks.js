const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const topiks = await prisma.topik.findMany({
    include: { mapel: true }
  });
  console.log(JSON.stringify(topiks.map(t => ({
    id: t.id,
    nama: t.nama,
    mapelKode: t.mapel.kode
  })), null, 2));
}

main().finally(() => prisma.$disconnect());
