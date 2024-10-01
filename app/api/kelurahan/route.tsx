import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: '103.151.145.21',
  database: 'pilkada',
  password: 'ifbumm',
  port: 5401,
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT k.id, k.kecamatan_id, k.nama, kc.nama AS kecamatan_nama
      FROM dev.kelurahan k
      JOIN dev.kecamatan kc ON k.kecamatan_id = kc.id
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching kelurahan:', error);
    return NextResponse.json({ error: 'Failed to fetch kelurahan data' }, { status: 500 });
  }
}
