// import { NextResponse } from 'next/server';
// import { Pool } from 'pg';

// const pool = new Pool({
//   user: 'postgres',
//   host: '103.151.145.21',
//   database: 'pilkada',
//   password: 'ifbumm',
//   port: 5401,
// });

// export async function GET() {
//   try {
//     const result = await pool.query(`
//       SELECT k.id, k.kecamatan_id, k.nama, kc.nama AS kecamatan_nama
//       FROM dev.kelurahan k
//       JOIN dev.kecamatan kc ON k.kecamatan_id = kc.id
//     `);
//     return NextResponse.json(result.rows);
//   } catch (error) {
//     console.error('Error fetching kelurahan:', error);
//     return NextResponse.json({ error: 'Failed to fetch kelurahan data' }, { status: 500 });
//   }
// }




import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const kelurahan = await prisma.kelurahan.findMany({
      include: {
        kecamatan: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
    });

    const formattedResult = kelurahan.map(k => ({
      id: k.id,
      kecamatan_id: k.kecamatan_id,
      nama: k.nama,
      kecamatan_nama: k.kecamatan?.nama,
    }));

    // console.log('Fetched kelurahan:', formattedResult);

    return NextResponse.json(formattedResult);
  } catch (error) {
    console.error('Error fetching kelurahan:', error);
    return NextResponse.json({ error: 'Failed to fetch kelurahan data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
