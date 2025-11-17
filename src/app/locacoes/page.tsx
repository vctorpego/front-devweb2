import { Rental, columns } from "./columns";
import { DataTable } from "./data-table";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

const getData = async (): Promise<Rental[]> => {
  try {
    const response = await fetch("http://localhost:8081/api/locacoes", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Erro na API");
    }

    const rentals = await response.json();

    return rentals.map((r: any) => ({
      id: r.id.toString(),
      clientName: r.cliente?.nome || "—",
      itemTitle: r.item?.titulo?.nome || "—",
      rentalDate: r.dataLocacao,
      expectedReturn: r.dataPrevista,
      actualReturn: r.dataDevolucao,
      isPaid: r.pago,
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
};

const RentalsPage = async () => {
  const data = await getData();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="px-4 py-2 bg-secondary rounded-md w-64">
          <h1 className="font-semibold">Gerenciamento de Locações</h1>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <button className="px-4 py-2 bg-primary text-white rounded-md">
              Nova Locação
            </button>
          </SheetTrigger>
        </Sheet>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default RentalsPage;
