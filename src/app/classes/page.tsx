import { Classe, columns } from "./columns";
import { DataTable } from "./data-table";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddClass from "@/components/AddClass";

const getData = async (): Promise<Classe[]> => {
    try {
      // Faz a chamada REAL para a API
      const response = await fetch('http://localhost:8080/api/classes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', 
      });
  
      if (!response.ok) {
        throw new Error(`Erro ao buscar classes: ${response.status}`);
      }
  
      const classesFromAPI = await response.json();
      
      // TRanforma os dados da api em formato de table
      const transformedData: Classe[] = classesFromAPI.map((classe: any) => ({
        id: classe.id.toString(),
        name: classe.nome, 
        value: classe.valor,
        prazoDevolucao: classe.prazoDevolucao || 0,
        titleCount: classe.titleCount || 0 
      }));
  
      return transformedData;
  
    } catch (error) {
      console.error('Erro ao buscar classes da API:', error);
      return [];
    }
    
  };

const ClassesPage = async () => {
  const data = await getData();
  
  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <div className="px-4 py-2 bg-secondary rounded-md w-64">
          <h1 className="font-semibold">Gerenciamento de Classes</h1>
        </div>
        <Sheet>
          <SheetTrigger asChild>
          </SheetTrigger>
          <AddClass />
        </Sheet>
      </div>
      
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default ClassesPage;