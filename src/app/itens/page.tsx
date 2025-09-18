import { Item, columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const getData = async (): Promise<Item[]> => {
  // Simulando dados de itens
  return [
    {
      id: "1",
      serialNumber: "SN001",
      title: "O Poderoso Chefão",
      acquisitionDate: "2023-01-15",
      type: "dvd",
      rentalCount: 12,
      status: "available"
    },
    {
      id: "2",
      serialNumber: "SN002",
      title: "Interestelar",
      acquisitionDate: "2023-02-20",
      type: "bluray",
      rentalCount: 8,
      status: "unavailable"
    },
    {
      id: "3",
      serialNumber: "SN003",
      title: "Pulp Fiction",
      acquisitionDate: "2023-03-10",
      type: "dvd",
      rentalCount: 15,
      status: "unavailable"
    },
    {
      id: "4",
      serialNumber: "SN004",
      title: "O Senhor dos Anéis",
      acquisitionDate: "2023-04-05",
      type: "bluray",
      rentalCount: 20,
      status: "available"
    },
    {
      id: "5",
      serialNumber: "SN005",
      title: "Clube da Luta",
      acquisitionDate: "2023-05-12",
      type: "dvd",
      rentalCount: 10,
      status: "available"
    },
    {
      id: "6",
      serialNumber: "SN006",
      title: "Matrix",
      acquisitionDate: "2023-06-18",
      type: "fita",
      rentalCount: 5,
      status: "unavailable"
    },
    {
      id: "7",
      serialNumber: "SN007",
      title: "Forrest Gump",
      acquisitionDate: "2023-07-22",
      type: "dvd",
      rentalCount: 18,
      status: "available"
    },
    {
      id: "8",
      serialNumber: "SN008",
      title: "Os Suspeitos",
      acquisitionDate: "2023-08-30",
      type: "bluray",
      rentalCount: 0,
      status: "available"
    },
    {
      id: "9",
      serialNumber: "SN009",
      title: "Gladiador",
      acquisitionDate: "2023-09-14",
      type: "dvd",
      rentalCount: 14,
      status: "unavailable"
    },
    {
      id: "10",
      serialNumber: "SN010",
      title: "Cidade de Deus",
      acquisitionDate: "2023-10-08",
      type: "bluray",
      rentalCount: 9,
      status: "unavailable"
    }
  ];
};

const ItemsPage = async () => {
  const data = await getData();
  
  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <div className="px-4 py-2 bg-secondary rounded-md w-64">
          <h1 className="font-semibold">Gerenciamento de Itens</h1>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Item
        </Button>
      </div>
      
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default ItemsPage;