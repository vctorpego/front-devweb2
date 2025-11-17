import { Return, columns } from "./columns";
import { DataTable } from "./data-table";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

const getData = async (): Promise<Return[]> => {
  try {
    const response = await fetch("http://localhost:8081/api/devolucoes", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Erro na API");
    }

    const returns = await response.json();

    return returns.map((d: any) => ({
      id: d.id.toString(),
      itemNumber: d.item?.numeroSerie || "—",
      itemTitle: d.item?.titulo?.nome || "—",
      clientName: d.cliente?.nome || "—",
      rentalDate: d.dataLocacao,
      expectedReturn: d.dataPrevista,
      actualReturn: d.dataDevolucao,
      lateFee: d.multa || 0,
      totalValue: d.valorTotal || 0,
      isLate: d.atrasada || false,
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
};

const ReturnsPage = async () => {
  const data = await getData();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="px-4 py-2 bg-secondary rounded-md w-64">
          <h1 className="font-semibold">Gerenciamento de Devoluções</h1>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <button className="px-4 py-2 bg-primary text-white rounded-md">
              Registrar Devolução
            </button>
          </SheetTrigger>
        </Sheet>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default ReturnsPage;
