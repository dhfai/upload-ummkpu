'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface GroupedData {
  kab_id: string;
  kabupaten_nama: string; // Make sure this is included in your data model
  kecamatan_id: string;
  kecamatan_nama: string;
  kelurahan_id: string;
  kelurahan_nama: string;
  tps_id: string;
  no_tps: string;
  l: number;
  p: number;
}

const KabupatenPage: React.FC = () => {
  const { id } = useParams();
  const [data, setData] = useState<GroupedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [kabupatenNama, setKabupatenNama] = useState<string | null>(null); // State to hold kabupaten name

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/groupedData/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        console.log('Grouped data:', result);

        // Set data and kabupaten name
        setData(result);
        setKabupatenNama(result[0]?.kabupaten_nama || null); // Assuming the kabupaten name is in the first item

      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Group data by kecamatan
  const groupedData = data.reduce((acc, item) => {
    const { kecamatan_nama } = item;
    if (!acc[kecamatan_nama]) {
      acc[kecamatan_nama] = [];
    }
    acc[kecamatan_nama].push(item);
    return acc;
  }, {} as Record<string, GroupedData[]>);

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Filtered data based on search term
  const filteredData = Object.entries(groupedData).reduce((acc, [kecamatan, items]) => {
    const filteredItems = items.filter(item =>
      String(item.no_tps).toLowerCase().includes(searchTerm) ||
      String(item.kelurahan_nama).toLowerCase().includes(searchTerm)
    );

    if (filteredItems.length) {
      acc[kecamatan] = filteredItems;
    }
    return acc;
  }, {} as Record<string, GroupedData[]>);

  // Handle delete
  const handleDelete = async (tps_id: string) => {
    console.log("Attempting to delete TPS ID:", tps_id);
    if (!tps_id) {
      console.error("tps_id is undefined");
      return;
    }
    try {
      const response = await fetch(`/api/delete/${tps_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete data');
      }

      // Update local state
      setData((prevData) => prevData.filter(item => item.tps_id !== tps_id));
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className='p-6'>
      <h1 className="text-2xl font-semibold mb-4">{kabupatenNama || `Kabupaten ${id}`}</h1> {/* Display kabupaten name */}

      <Input
        placeholder="Search by No TPS or Kelurahan"
        className="mb-4"
        value={searchTerm}
        onChange={handleSearch}
      />
        {Object.entries(filteredData).length === 0 ? (
            <div>No data available</div>
        ): Object.entries(filteredData).map(([kelurahan, items]) => (
            <div
              key={kelurahan}
              className={`overflow-x-auto w-full mb-10 border rounded-lg border-gray-300 shadow-lg' : ''}`} // Atur opacity jika dinonaktifkan
            >
                <Table className="min-w-full divide-y divide-gray-200">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kecamatan
                      </TableHead>
                      <TableHead className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kelurahan
                      </TableHead>
                      <TableHead className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        TPS
                      </TableHead>
                      <TableHead className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        L
                      </TableHead>
                      <TableHead className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        P
                      </TableHead>
                      <TableHead className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index} className="bg-white hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.kecamatan_nama}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.kelurahan_nama}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.no_tps}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.l}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.p}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDelete(item.tps_id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                          >
                            Hapus
                          </button>
                        </td>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </div>
          ))}

      {/* {Object.entries(filteredData).length === 0 ? (
        <div>No data available for this kabupaten.</div>
      ) : (
        Object.entries(filteredData).map(([kecamatan, items]) => (
          <div key={kecamatan} className="mb-6">
            <h2 className="text-xl font-bold">{kecamatan}</h2>
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Kelurahan</TableHead>
                  <TableHead>No TPS</TableHead>
                  <TableHead>L</TableHead>
                  <TableHead>P</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.tps_id}>
                    <TableCell>{item.kelurahan_nama}</TableCell>
                    <TableCell>{item.no_tps}</TableCell>
                    <TableCell>{item.l}</TableCell>
                    <TableCell>{item.p}</TableCell>
                    <TableCell>
                      <Button variant="outline" style={{color: 'red'}} onClick={() => handleDelete(item.tps_id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))
      )} */}
    </div>
  );
};

export default KabupatenPage;
