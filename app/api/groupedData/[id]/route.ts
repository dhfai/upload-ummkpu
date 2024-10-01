import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres', // Change to your PostgreSQL username
  host: '103.151.145.21',
  database: 'pilkada', // Change to your database name
  password: 'ifbumm', // Change to your PostgreSQL password
  port: 5401,
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Get the kabupaten ID from the route parameters

  try {
    const result = await pool.query(`
      SELECT
          kab.id AS kab_id,
          kab.nama AS kabupaten_nama,
          kec.id AS kecamatan_id,
          kec.nama AS kecamatan_nama,
          kel.id AS kelurahan_id,
          kel.nama AS kelurahan_nama,
          t.id AS tps_id,
          t.no_tps,
          t.l,
          t.p
      FROM dev.kabupaten kab
      JOIN dev.kecamatan kec ON kab.id = kec.kab_id
      JOIN dev.kelurahan kel ON kec.id = kel.kecamatan_id
      JOIN dev.tps t ON kel.id = t.kelurahan_id
      WHERE kab.id = $1
      ORDER BY kec.id, kel.id, t.no_tps;
    `, [id]); // Use parameterized query for security

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching grouped data:', error);
    return NextResponse.json({ error: 'Failed to fetch grouped data' }, { status: 500 });
  }
}
