'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Spinner from '@/components/ui/spinner';

interface GroupedData {
  kab_id: string;
  kabupaten_nama: string;
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
  const [kabupatenNama, setKabupatenNama] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/groupedData/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
        setKabupatenNama(result[0]?.kabupaten_nama || null);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  const groupedData = data.reduce((acc, item) => {
    const { kecamatan_nama, kelurahan_nama } = item;
    if (!acc[kecamatan_nama]) {
      acc[kecamatan_nama] = {};
    }
    if (!acc[kecamatan_nama][kelurahan_nama]) {
      acc[kecamatan_nama][kelurahan_nama] = [];
    }
    acc[kecamatan_nama][kelurahan_nama].push(item);
    return acc;
  }, {} as Record<string, Record<string, GroupedData[]>>);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredData = Object.entries(groupedData).reduce((acc, [kecamatan, kelurahanItems]) => {
    const filteredKelurahanItems = Object.entries(kelurahanItems).reduce((kelAcc, [kelurahan, items]) => {
      const filteredItems = items.filter(item =>
        String(item.no_tps).toLowerCase().includes(searchTerm) ||
        String(item.kelurahan_nama).toLowerCase().includes(searchTerm)
      );

      if (filteredItems.length) {
        kelAcc[kelurahan] = filteredItems;
      }
      return kelAcc;
    }, {} as Record<string, GroupedData[]>);

    if (Object.keys(filteredKelurahanItems).length) {
      acc[kecamatan] = filteredKelurahanItems;
    }

    return acc;
  }, {} as Record<string, Record<string, GroupedData[]>>);

  const handleDelete = async (tps_id: string) => {
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

  // Calculate totals for any group of data
  const calculateTotals = (items: GroupedData[]) => {
    const totalTPS = items.length;
    const totalL = items.reduce((sum, item) => sum + item.l, 0);
    const totalP = items.reduce((sum, item) => sum + item.p, 0);
    return { totalTPS, totalL, totalP };
  };

  // Total for the entire Kabupaten
  const kabupatenTotals = calculateTotals(data);

  return (
    <div className="p-6 w-full">
      <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">{kabupatenNama || `Kabupaten ${id}`}</h1>
        <p>Total TPS: {kabupatenTotals.totalTPS}</p>
        <p>Total L: {kabupatenTotals.totalL}</p>
        <p>Total P: {kabupatenTotals.totalP}</p>
      </div>
      <Input
        placeholder="Search by No TPS or Kelurahan"
        className="mb-4"
        value={searchTerm}
        onChange={handleSearch}
      />



      {Object.entries(filteredData).length === 0 ? (
        <div className="text-gray-500">No data available</div>
      ) : Object.entries(filteredData).map(([kecamatan, kelurahanItems]) => {
        const kecamatanTotals = calculateTotals(Object.values(kelurahanItems).flat());

        return (
          <div key={kecamatan} className="mb-10">
            <h2 className="text-xl font-semibold mb-2">Kecamatan: {kecamatan}</h2>
            <p>Total TPS: {kecamatanTotals.totalTPS}, Total L: {kecamatanTotals.totalL}, Total P: {kecamatanTotals.totalP}</p>

            {Object.entries(kelurahanItems).map(([kelurahan, items]) => {
              const kelurahanTotals = calculateTotals(items);

              return (
                <div key={kelurahan} className="mb-6">
                  <div className="overflow-x-auto w-full mb-4 border rounded-lg border-gray-300 shadow-lg">
                    <Table className="min-w-full divide-y divide-gray-200">
                      <TableHeader className="bg-black ">
                        <TableRow>
                          <TableHead>Kecamatan</TableHead>
                          <TableHead>Kelurahan</TableHead>
                          <TableHead>No TPS</TableHead>
                          <TableHead>L</TableHead>
                          <TableHead>P</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item, index) => (
                          <TableRow key={index} className="bg-white hover:bg-gray-50">
                            <TableCell>{kecamatan}</TableCell>
                            <TableCell>{item.kelurahan_nama}</TableCell>
                            <TableCell>{item.no_tps}</TableCell>
                            <TableCell>{item.l}</TableCell>
                            <TableCell>{item.p}</TableCell>
                            <TableCell>
                              <Button
                                onClick={() => handleDelete(item.tps_id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                              >
                                Hapus
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter className='bg-foreground'>
                        <TableRow>
                          <TableCell>Total</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                          <TableCell>{kelurahanTotals.totalL}</TableCell>
                          <TableCell>{kelurahanTotals.totalP}</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default KabupatenPage;
