import { Director, columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const getData = async (): Promise<Director[]> => {
  // Simulando dados de diretores
  return [
    {
      id: "1",
      name: "Steven Spielberg",
      titleCount: 5
    },
    {
      id: "2",
      name: "Christopher Nolan",
      titleCount: 3
    },
    {
      id: "3",
      name: "Quentin Tarantino",
      titleCount: 4
    },
    {
      id: "4",
      name: "Martin Scorsese",
      titleCount: 2
    },
    {
      id: "5",
      name: "James Cameron",
      titleCount: 6
    },
    {
      id: "6",
      name: "Greta Gerwig",
      titleCount: 1
    },
    {
      id: "7",
      name: "Alfred Hitchcock",
      titleCount: 8
    },
    {
      id: "8",
      name: "Tim Burton",
      titleCount: 0
    },
    {
      id: "9",
      name: "Ridley Scott",
      titleCount: 7
    },
    {
      id: "10",
      name: "David Fincher",
      titleCount: 2
    }
  ];
};

const DirectorsPage = async () => {
  const data = await getData();
  
  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <div className="px-4 py-2 bg-secondary rounded-md w-64">
          <h1 className="font-semibold">Gerenciamento de Diretores</h1>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Diretor
        </Button>
      </div>
      
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default DirectorsPage;