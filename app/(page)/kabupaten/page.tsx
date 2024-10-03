'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Page() {
    const [kabupatenList, setKabupatenList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/kabupaten');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const result = await response.json();
                // console.log('Grouped data:', result);
                setKabupatenList(result);
            } catch (error: any) {
                console.error(error.message);
            }
        };

        fetchData();
    }, []);

  return (
    <div className='container mx-auto mt-8 p-4'>
      <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {kabupatenList.map((kabupaten: any) => (
          <li key={kabupaten.kab_id} className='bg-white shadow-md rounded-lg p-4 hover:bg-gray-100 transition duration-200'>
            <Link href={`/kabupaten/${kabupaten.id}`}>
              <span>{kabupaten.nama}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
