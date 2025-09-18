import { Title, columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const getData = async (): Promise<Title[]> => {
  // Simulando dados de títulos
  return [
    {
      id: "1",
      name: "O Poderoso Chefão",
      director: "Francis Ford Coppola",
      year: 1972,
      category: "Drama",
      className: "Classe A",
      itemCount: 3,
    },
    {
      id: "2",
      name: "Interestelar",
      director: "Christopher Nolan",
      year: 2014,
      category: "Ficção Científica",
      className: "Classe B",
      itemCount: 5,
    },
    {
      id: "3",
      name: "Pulp Fiction",
      director: "Quentin Tarantino",
      year: 1994,
      category: "Crime",
      className: "Classe A",
      itemCount: 2,
    },
    {
      id: "4",
      name: "O Senhor dos Anéis",
      director: "Peter Jackson",
      year: 2001,
      category: "Fantasia",
      className: "Classe C",
      itemCount: 8,
    },
    {
      id: "5",
      name: "Clube da Luta",
      director: "David Fincher",
      year: 1999,
      category: "Drama",
      className: "Classe B",
      itemCount: 4,
    },
    {
      id: "6",
      name: "Matrix",
      director: "Lana Wachowski",
      year: 1999,
      category: "Ficção Científica",
      className: "Classe A",
      itemCount: 6,
    },
    {
      id: "7",
      name: "Forrest Gump",
      director: "Robert Zemeckis",
      year: 1994,
      category: "Drama",
      className: "Classe B",
      itemCount: 3,
    },
    {
      id: "8",
      name: "Os Suspeitos",
      director: "Bryan Singer",
      year: 1995,
      category: "Suspense",
      className: "Classe A",
      itemCount: 0,
    },
    {
      id: "9",
      name: "Gladiador",
      director: "Ridley Scott",
      year: 2000,
      category: "Ação",
      className: "Classe C",
      itemCount: 7,
    },
    {
      id: "10",
      name: "Cidade de Deus",
      director: "Fernando Meirelles",
      year: 2002,
      category: "Drama",
      className: "Classe B",
      itemCount: 5,
    }
  ];
};

const TitlesPage = async () => {
  const data = await getData();
  
  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <div className="px-4 py-2 bg-secondary rounded-md w-64">
          <h1 className="font-semibold">Gerenciamento de Títulos</h1>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Título
        </Button>
      </div>
      
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default TitlesPage;