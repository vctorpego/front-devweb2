import { Classe, columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const getData = async (): Promise<Classe[]> => {
  // Simulando dados de classes
  return [
    {
      id: "1",
      name: "Classe A",
      value: 20.00,
      returnDate: "2024-12-31",
      titleCount: 5
    },
    {
      id: "2",
      name: "Classe B",
      value: 20.00,
      returnDate: "2024-11-15",
      titleCount: 3
    },
    {
      id: "3",
      name: "Classe C",
      value: 30.00,
      returnDate: "2024-10-20",
      titleCount: 8
    },
    {
      id: "4",
      name: "Classe D",
      value: 40.00,
      returnDate: "2024-09-30",
      titleCount: 2
    },
    {
      id: "5",
      name: "Classe E",
      value: 50.00,
      returnDate: "2024-08-15",
      titleCount: 12
    },
    {
      id: "6",
      name: "Classe F",
      value: 60.00,
      returnDate: "2024-07-10",
      titleCount: 6
    },
    {
      id: "7",
      name: "Classe G",
      value: 70.00,
      returnDate: "2024-06-25",
      titleCount: 4
    },
    {
      id: "8",
      name: "Classe H",
      value: 80.00,
      returnDate: "2024-05-20",
      titleCount: 0
    },
    {
      id: "9",
      name: "Classe I",
      value: 90.00,
      returnDate: "2024-04-15",
      titleCount: 15
    },
    {
      id: "10",
      name: "Classe J",
      value: 100.00,
      returnDate: "2024-03-10",
      titleCount: 7
    }
  ];
};

const ClassesPage = async () => {
  const data = await getData();
  
  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <div className="px-4 py-2 bg-secondary rounded-md w-64">
          <h1 className="font-semibold">Gerenciamento de Classes</h1>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Classe
        </Button>
      </div>
      
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default ClassesPage;