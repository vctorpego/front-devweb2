
import AddActor from "@/components/AddActor";
import { Actor, columns } from "./columns";
import { DataTable } from "./data-table";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

const getData = async (): Promise<Actor[]> => {
  try {
    const response = await fetch('http://localhost:8081/api/atores', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar atores: ${response.status}`);
    }

    const atoresFromAPI = await response.json();

    const transformedData: Actor[] = atoresFromAPI.map((ator: any) => ({
      id: ator.id.toString(),
      name: ator.nome,
      titleCount: ator.titleCount || 0
    }));

    return transformedData;

  } catch (error) {
    console.error('Erro ao buscar atores da API:', error);
    return [];
  }
};

const ActorsPage = async () => {
  const data = await getData();

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <div className="px-4 py-2 bg-secondary rounded-md w-64">
          <h1 className="font-semibold">Gerenciamento de Atores</h1>
        </div>
        <Sheet>
          <SheetTrigger asChild>
          </SheetTrigger>
          <AddActor />
        </Sheet>

      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default ActorsPage;