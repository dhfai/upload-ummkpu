'use client';

import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import GroupedDataTable from '@/components/GroupedDataTable';

interface DataRow {
  Kecamatan: string;
  Kelurahan: string;
  TPS: string;
  L: number;
  P: number;
  status: string;
}

type GroupedData = {
  [kelurahan: string]: DataRow[];
};

export default function Page({ params }: { params: { fileName: string } }) {
  const [data, setData] = useState<DataRow[]>([]);
  const [groupedData, setGroupedData] = useState<GroupedData>({});

  const { fileName } = params;

  useEffect(() => {
    const readExcelData = async () => {
      try {
        const response = await fetch(`/${fileName}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }

        const fileData = await response.arrayBuffer();
        const workbook = XLSX.read(fileData, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<DataRow>(worksheet);
        setData(jsonData);
      } catch (error) {
        console.error('Error reading Excel file:', error);
      }
    };

    readExcelData();
  }, [fileName]);

  useEffect(() => {
    const grouped: GroupedData = {};
    data.forEach((row) => {
      if (!grouped[row.Kelurahan]) {
        grouped[row.Kelurahan] = [];
      }
      grouped[row.Kelurahan].push(row);
    });
    setGroupedData(grouped);
  }, [data]);

  return (
      <div className="flex flex-col p-6">
        <div className="overflow-x-auto pb-4">
            <GroupedDataTable groupedData={groupedData} />
      </div>
    </div>
  );
}
