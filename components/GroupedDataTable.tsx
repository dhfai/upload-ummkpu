import { Table, TableBody, TableRow } from '@/components/ui/table';
import DataSheets from '@/components/DataSheets';

interface DataRow {
  Kecamatan: string;
  Kelurahan: string;
  TPS: string;
  L: number;
  P: number;
}

type GroupedData = {
  [kelurahan: string]: DataRow[];
};

interface GroupedDataTableProps {
  groupedData: GroupedData;
}

const GroupedDataTable: React.FC<GroupedDataTableProps> = ({ groupedData }) => {
  return (
    <div className="block">
      {Object.entries(groupedData).map(([kelurahan, rows]) => (
        <div
          key={kelurahan}
          className={`overflow-x-auto w-full mb-10 border rounded-lg border-gray-300 shadow-lg`}
        >
          <Table className="min-w-full divide-y divide-gray-200">
            <thead>
              <TableRow>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kecamatan
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kelurahan
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TPS
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  L
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  P
                </th>
              </TableRow>
            </thead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index} className="bg-white hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.Kecamatan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.Kelurahan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.TPS}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.L}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.P}
                  </td>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between p-4 bg-gray-50">
            <DataSheets rows={rows} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupedDataTable;
