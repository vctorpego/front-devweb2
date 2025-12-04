import { AddDevolution } from "@/components/AddDevolution";
import { Return, columns } from "./columns";
import { DataTable } from "./data-table";

// FUNÇÃO getData COM CÁLCULO DE MULTA
const getData = async (): Promise<Return[]> => {
  try {
    // Buscar todos os dados de uma vez
    const [locacoesRes, itensRes, clientesRes, titulosRes] = await Promise.all([
      fetch("http://localhost:8081/api/locacoes", { cache: "no-store" }),
      fetch("http://localhost:8081/api/itens", { cache: "no-store" }),
      fetch("http://localhost:8081/api/clientes", { cache: "no-store" }),
      fetch("http://localhost:8081/api/titulos", { cache: "no-store" })
    ]);

    if (!locacoesRes.ok) throw new Error("Erro na API de locações");

    const locacoes = await locacoesRes.json();
    const itens = await itensRes.json();
    const clientes = await clientesRes.json();
    const titulos = await titulosRes.json();

    // Criar mapas para acesso rápido
    const itensMap = new Map<number, any>(itens.map((i: any) => [i.id, i]));
    const clientesMap = new Map<number, any>(clientes.map((c: any) => [c.id, c]));
    const titulosMap = new Map<number, any>(titulos.map((t: any) => [t.id, t]));

    // Filtrar apenas devolvidas (dtDevolucaoEfetiva != null)
    const devolvidas = locacoes
    .filter((d: any) => d.dtDevolucaoEfetiva !== null)
      .map((d: any) => {
        const item = itensMap.get(d.itemId);
        const cliente = clientesMap.get(d.clienteId);
        const titulo = item?.tituloId ? titulosMap.get(item.tituloId) : null;

        // --- Cálculo da multa no front ---
        const expected = new Date(d.dtDevolucaoPrevista);
        const actual = new Date(d.dtDevolucaoEfetiva);


        const diffMs = actual.getTime() - expected.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        const lateFeeFront = diffDays > 0 ? diffDays * 2 : 0;
        const isLateFront = diffDays > 0;

        return {
          id: d.id.toString(),
          itemNumber: item?.numeroSerie || "—",
          itemTitle: titulo?.nome || "—",
          clientName: cliente?.nome || "—",
          rentalDate: d.dtLocacao,
          expectedReturn: d.dtDevolucaoPrevista,
          actualReturn: d.dtDevolucaoEfetiva,

          // MULTA CALCULADA NO FRONT, caso o back não envie
          lateFee: d.multaCobrada ?? lateFeeFront,
          isLate: d.estaEmAtraso ?? isLateFront,

          totalValue: d.valorCobrado || 0,
        };
      });

    return devolvidas;
  } catch (err) {
    console.error(err);
    return [];
  }
};

const ReturnsPage = async () => {
  const data = await getData();
  
  console.log("Total de locações devolvidas:", data.length);
  console.log("Primeiro item:", data[0]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="px-4 py-2 bg-secondary rounded-md w-64">
          <h1 className="font-semibold">Gerenciamento de Devoluções</h1>
        </div>

        <div className="px-4 py-2">
          <AddDevolution />
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          <p className="text-muted-foreground">Nenhuma devolução registrada.</p>
        </div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  );
};

export default ReturnsPage;
