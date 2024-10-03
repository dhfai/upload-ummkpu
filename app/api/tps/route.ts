// import { NextRequest, NextResponse } from 'next/server';
// import { Pool } from 'pg';

// const pool = new Pool({
//   user: 'postgres',
//   host: '103.151.145.21',
//   database: 'pilkada',
//   password: 'ifbumm',
//   port: 5401,
// });

// export async function POST(req: NextRequest) {
//   try {
//     const { data } = await req.json();

//     const client = await pool.connect();

//     const results = [];

//     // Loop through each row and check if it exists in the database
//     for (const row of data) {
//       const { kelurahan_id, tps, l, p } = row;

//       // Check if data already exists
//       const checkQuery = `
//         SELECT * FROM dev.tps
//         WHERE kelurahan_id = $1 AND no_tps = $2
//       `;
//       const checkResult = await client.query(checkQuery, [kelurahan_id, tps]);

//       if (checkResult.rows.length > 0) {
//         // If data exists, return an error message
//         results.push({ success: false, message: `TPS ${tps} itu sudah ada kocak.` });
//       } else {
//         // Insert new data if it doesn't exist
//         const insertQuery = `
//           INSERT INTO dev.tps (kelurahan_id, no_tps, l, p)
//           VALUES ($1, $2, $3, $4)
//         `;
//         await client.query(insertQuery, [kelurahan_id, tps, l, p]);
//         results.push({ success: true, message: `TPS ${tps} sukses di upload` });
//       }
//     }

//     client.release();
//     return NextResponse.json({ results });
//   } catch (error) {
//     console.error("Error inserting data:", error);
//     return NextResponse.json({ error: "Error processing request." }, { status: 500 });
//   }
// }




import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { data } = await req.json();

    const results = [];

    // Loop through each row and insert data into the database
    for (const row of data) {
      const { kelurahan_id, tps, l, p } = row;

      // Insert new data directly
      await prisma.tps.create({
        data: {
          kelurahan_id,
          no_tps: tps,
          l,
          p,
        },
      });

      results.push({ success: true, message: `TPS ${tps} sukses di upload` });
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error inserting data:", error);
    return NextResponse.json({ error: "Error processing request." }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Ensure that the connection is closed
  }
}
