import React from 'react';
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X } from 'lucide-react';

interface Kelurahan {
  id: number;
  kecamatan_id: number;
  nama: string;
  kecamatan_nama: string;
}

interface DataSheetsProps {
  rows: {
    Kecamatan: string;
    Kelurahan: string;
    TPS: string;
    L: number;
    P: number;
  }[];
}

export default function DataSheets({ rows: initialRows }: DataSheetsProps) {
  const [kelurahan, setKelurahan] = React.useState<Kelurahan[]>([]);
  const [selectedKelurahan, setSelectedKelurahan] = React.useState<string>("");
  const [filteredKelurahan, setFilteredKelurahan] = React.useState<Kelurahan[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [rows, setRows] = React.useState(initialRows); // State for storing the rows data
  const [message, setMessage] = React.useState<string>("");

  // Fetch Kelurahan data from API
  React.useEffect(() => {
    const fetchKelurahan = async () => {
      try {
        const response = await fetch("/api/kelurahan");
        const data = await response.json();
        setKelurahan(data);
        setFilteredKelurahan(data);
      } catch (error) {
        console.error("Error fetching kelurahan:", error);
      }
    };

    fetchKelurahan();
  }, []);

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredKelurahan(
      kelurahan.filter((item) => item.nama.toLowerCase().includes(query))
    );
  };

  // Handle kelurahan selection
  const handleKelurahanSelect = (namaKelurahan: string) => {
    setSelectedKelurahan(namaKelurahan);
    setDropdownOpen(false);
  };

  // Handle delete row
  const handleDeleteRow = (indexToDelete: number) => {
    const updatedRows = rows.filter((_, index) => index !== indexToDelete); // Remove row based on index
    setRows(updatedRows); // Update rows state
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedKelurahan) {
      setMessage("Pilih Kelurahan Dulu Ngab.");
      return;
    }

    const kelurahanData = kelurahan.find((k) => k.nama === selectedKelurahan);

    if (!kelurahanData) {
      setMessage("Invalid Kelurahan selected.");
      return;
    }

    // Prepare data for submission
    const dataToSubmit = rows.map((row) => ({
      kelurahan_id: kelurahanData.id,
      tps: row.TPS,
      l: row.L,
      p: row.P,
    }));

    try {
      const response = await fetch("/api/tps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: dataToSubmit }),
      });

      const result = await response.json();

      // Display success or error message based on result
      const successMessages = result.results
        .filter((res: any) => res.success)
        .map((res: any) => res.message)
        .join("\n");

      const errorMessages = result.results
        .filter((res: any) => !res.success)
        .map((res: any) => res.message)
        .join("\n");

      setMessage(`${successMessages}\n${errorMessages}`);
    } catch (error) {
      setMessage("Error submitting data.");
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full bg-foreground hover:bg-background">
          Upload Data
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-foreground backdrop-blur-lg border-none">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="text-center">
            <DrawerTitle className="text-lg font-bold">Data TPS</DrawerTitle>
          </DrawerHeader>

          {/* Dropdown for selecting Kelurahan */}
          <div className="relative mt-4">
            <Button
              variant="outline"
              className="w-full justify-between bg-foreground hover:bg-background"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {selectedKelurahan || "Pilih Kelurahan"}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>

            {dropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md max-h-60 overflow-auto shadow-lg">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Cari kelurahan..."
                  className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none"
                />
                {filteredKelurahan.length > 0 ? (
                  filteredKelurahan.map((item) => (
                    <div
                      key={item.id}
                      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                        selectedKelurahan === item.nama ? "bg-gray-200" : ""
                      }`}
                      onClick={() => handleKelurahanSelect(item.nama)}
                    >
                      Kec. {item.kecamatan_nama} - {item.nama}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-gray-500">Tidak ada data kelurahan.</div>
                )}
              </div>
            )}
          </div>

          <div className="max-h-[200px] overflow-y-auto mt-4">
            <Table>
              <TableCaption>Data TPS Berdasarkan Kelurahan</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Kelurahan</TableHead>
                  <TableHead className="text-center">TPS</TableHead>
                  <TableHead className="text-center">L</TableHead>
                  <TableHead className="text-center">P</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center">{row.Kelurahan}</TableCell>
                    <TableCell className="text-center">{row.TPS}</TableCell>
                    <TableCell className="text-center">{row.L}</TableCell>
                    <TableCell className="text-center">{row.P}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRow(index)}
                        className='bg-foreground hover:bg-background'
                      >
                        <X size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {message && (
            <div className="mt-4 p-2 bg-gray-200 rounded-md">
              <p>{message}</p>
            </div>
          )}

          <DrawerFooter className="flex justify-between mt-6">
            <Button className='bg-foreground hover:bg-background' variant={'outline'} onClick={handleSubmit}>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline" className='bg-foreground hover:bg-background'>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
