import { Client, columns } from "./columns";
import { DataTable } from "./data-table";
import AddClients from "@/components/AddClients";

const getData = async (): Promise<Client[]> => {
  try {
    const [sociosRes, depRes] = await Promise.all([
      fetch("http://localhost:8081/api/socios", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }),
      fetch("http://localhost:8081/api/dependentes", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }),
    ]);

    if (!sociosRes.ok || !depRes.ok) {
      throw new Error("Erro na API");
    }

    const socios = await sociosRes.json();
    const dependentes = await depRes.json();

    const formatSocios = socios.map((s: any) => ({
      id: `s-${s.id}`,
      nome: s.nome, 
      cpf: s.cpf,
      telefone: s.telefone,
      dependentsCount: s.quantidadeDependentesAtivos || 0,
      estahAtivo: s.estahAtivo, 
      tipoCliente: "Sócio", 
      dtNascimento: s.dtNascimento || "", 
      sexo: s.sexo || "MASCULINO", 
      endereco: s.endereco || "", 
      socioId: undefined,
      numInscricao: s.numInscricao || "" 
    }));

    const formatDependentes = dependentes.map((d: any) => ({
      id: `d-${d.id}`,
      nome: d.nome, 
      cpf: " ",            
      telefone: d.telefone || " ",
      dependentsCount: 0,
      estahAtivo: Boolean(d.estahAtivo), 
      tipoCliente: "Dependente", 
      dtNascimento: d.dtNascimento || "", 
      sexo: d.sexo || "MASCULINO", 
      endereco: "", 
      socioId: String(d.socioId) || "",
      numInscricao: d.numInscricao || "" 
    }));

    return [...formatSocios, ...formatDependentes];
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

        <div className="px-4 py-2">
          <AddClients />
        </div>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default ClientsPage;