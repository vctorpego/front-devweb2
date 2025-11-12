import AddDirector from "@/components/AddDirector";
import { Director, columns } from "./columns";
import { DataTable } from "./data-table";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

const getData = async (): Promise<Director[]> => {
  try {
    const response = await fetch('http://localhost:8081/api/diretores', {
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

    const transformedData: Director[] = atoresFromAPI.map((ator: any) => ({
      id: ator.id.toString(),
      name: ator.nome,
      titleCount: ator.titulos || 0
    }));

    return transformedData;

  } catch (error) {
    console.error('Erro ao buscar diretores da API:', error);
    return [];
  }
};

const DirectorsPage = async () => {
  const data = await getData();

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <div className="px-4 py-2 bg-secondary rounded-md w-64">
          <h1 className="font-semibold">Gerenciamento de Diretores</h1>
        </div>
        <Sheet>
          <SheetTrigger asChild>
          </SheetTrigger>
          <AddDirector />
        </Sheet>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default DirectorsPage;