import { Rental, columns } from "./columns";
import { DataTable } from "./data-table";
import AddLocation from "@/components/AddLocation";

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
      id: r.id,
      clienteNome: r.clienteNome,
      tituloNome: r.tituloNome,
      dtLocacao: r.dtLocacao,
      dtDevolucaoPrevista: r.dtDevolucaoPrevista,
      dtDevolucaoEfetiva: r.dtDevolucaoEfetiva,
      estahPaga: r.estahPaga,
    }));
  } catch (err) {
    console.error("Erro no getData:", err);
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

        <div className="px-4 py-2">
          <AddLocation />
        </div>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default RentalsPage;
