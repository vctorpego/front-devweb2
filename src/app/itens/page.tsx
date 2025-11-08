import { Item, columns } from "./columns";
import { DataTable } from "./data-table";
import AddItem from "@/components/AddItem";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

const getData = async (): Promise<Item[]> => {
  try {
    const res = await fetch("http://localhost:8080/api/itens", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Erro ao buscar itens");
    }

    const items = await res.json();

    return items.map((item: any) => ({
      id: item.id?.toString() ?? "",
      serialNumber: item.numeroSerie,
      title: item.tituloNome,
      acquisitionDate: item.dataAquisicao,
      type: item.tipo?.toLowerCase() ?? "",
      rentalCount: item.quantidadeAlugueis ?? 0,
      status: item.status ?? "available",
    }));
  } catch (error) {
    console.error("Erro ao carregar itens:", error);
    return [];
  }
};

const ItemsPage = async () => {
  const data = await getData();

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <div className="px-4 py-2 bg-secondary rounded-md w-64">
          <h1 className="font-semibold">Gerenciamento de Itens</h1>
        </div>
        <Sheet>
          <SheetTrigger asChild>
          </SheetTrigger>
          <AddItem />
        </Sheet>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default ItemsPage;