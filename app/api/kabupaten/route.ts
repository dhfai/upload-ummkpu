import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres', // Change to your PostgreSQL username
  host: '103.151.145.21',
  database: 'pilkada', // Change to your database name
  password: 'ifbumm', // Change to your PostgreSQL password
  port: 5401,
});


export async function GET() {
    try {
        const result = await pool.query(`
            SELECT * FROM dev.kabupaten;
        `);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching kabupaten:', error);
        return NextResponse.json({ error: 'Failed to fetch kabupaten' }, { status: 500 });
    }
}
