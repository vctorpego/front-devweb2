import { Client, columns } from "./columns";
import { DataTable } from "./data-table";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

const getData = async (): Promise<Client[]> => {
  try {
    const response = await fetch("http://localhost:8081/api/clientes", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Erro na API");
    }

    const clients = await response.json();

    return clients.map((c: any) => ({
      id: c.id.toString(),
      name: c.nome,
      cpf: c.cpf,
      phone: c.telefone,
      dependentsCount: c.dependentes || 0,
      isActive: c.ativo,
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
};

const ClientsPage = async () => {
  const data = await getData();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="px-4 py-2 bg-secondary rounded-md w-64">
          <h1 className="font-semibold">Gerenciamento de Clientes</h1>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <button className="px-4 py-2 bg-primary text-white rounded-md">
              Novo Cliente
            </button>
          </SheetTrigger>
        </Sheet>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default ClientsPage;
