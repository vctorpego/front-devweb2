import { Title, columns } from "./columns";
import { DataTable } from "./data-table";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import AddTitle from "@/components/AddTitle";

const getData = async (): Promise<Title[]> => {
  try {
    // Buscar títulos
    const resTitles = await fetch("http://localhost:8080/api/titulos", { cache: "no-store" });
    const titlesFromAPI = await resTitles.json();

    // Buscar diretores
    const resDirectors = await fetch("http://localhost:8080/api/diretores", { cache: "no-store" });
    const directors = await resDirectors.json();
    const directorMap = new Map(directors.map((d: any) => [d.id, d.nome]));

    // Buscar atores
    const resActors = await fetch("http://localhost:8080/api/atores", { cache: "no-store" });
    const actors = await resActors.json();
    const actorsMap = new Map(actors.map((a: any) => [a.id, a.nome]));

    console.log("Exemplo de título:", titlesFromAPI[0]);

    //Buscar classes
    const resClass = await fetch("http://localhost:8080/api/classes", { cache: "no-store" });
    const classe = await resClass.json();
    const classMap = new Map(classe.map((c: any) => [c.id, c.nome]));

    // Transformar títulos para o DataTable
    const transformedData: Title[] = titlesFromAPI.map((title: any) => ({
      id: title.id.toString(),
      name: title.nome,
      director: directorMap.get(title.diretorId) || "—",
      year: title.ano,
      category: title.categoria,
      className: classMap.get(title.classeId) || "—",
      itemCount: title.quantidadeItensDisponiveis || 0,
      actors: title.atoresIds?.map((id: number) => actorsMap.get(id)).filter(Boolean).join(", ") || "—",
      
      nome: title.nome,
      nomeOriginal: title.nomeOriginal,
      sinopse: title.sinopse,
      diretorId: title.diretorId,
      classeId: title.classeId,
      atoresIds: title.atoresIds || [],
    }));
    
    return transformedData;

  } catch (error) {
    console.error("Erro ao buscar títulos da API:", error);
    return [];
  }
};

export default async function TitlesPage() {
  const data = await getData();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="px-4 py-2 bg-secondary rounded-md w-64">
          <h1 className="font-semibold">Gerenciamento de Títulos</h1>
        </div>
        <Sheet>
          <SheetTrigger asChild>
          </SheetTrigger>
          <AddTitle />
        </Sheet>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}