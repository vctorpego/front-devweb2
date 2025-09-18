import { Actor, columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const getData = async (): Promise<Actor[]> => {
  // Simulando dados de atores
  return [
    {
      id: "1",
      name: "Tom Hanks",
      titleCount: 5
    },
    {
      id: "2",
      name: "Meryl Streep",
      titleCount: 3
    },
    {
      id: "3",
      name: "Leonardo DiCaprio",
      titleCount: 4
    },
    {
      id: "4",
      name: "Jennifer Lawrence",
      titleCount: 2
    },
    {
      id: "5",
      name: "Denzel Washington",
      titleCount: 6
    },
    {
      id: "6",
      name: "Emma Stone",
      titleCount: 1
    },
    {
      id: "7",
      name: "Robert De Niro",
      titleCount: 8
    },
    {
      id: "8",
      name: "Cate Blanchett",
      titleCount: 0
    },
    {
      id: "9",
      name: "Brad Pitt",
      titleCount: 7
    },
    {
      id: "10",
      name: "Natalie Portman",
      titleCount: 2
    }
  ];
};

const ActorsPage = async () => {
  const data = await getData();
  
  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <div className="px-4 py-2 bg-secondary rounded-md w-64">
          <h1 className="font-semibold">Gerenciamento de Atores</h1>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Ator
        </Button>
      </div>
      
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default ActorsPage;