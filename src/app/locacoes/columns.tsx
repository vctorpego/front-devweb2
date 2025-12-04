"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  Trash2,
  Pencil,
  DollarSign,
} from "lucide-react";

import { useState } from "react";
import EditLocation from "@/components/EditLocation";
import { DeleteGeneric } from "@/components/DeleteGeneric";

// ---------- TYPES AJUSTADOS À API ----------
export type Rental = {
  id: number;
  clienteNome: string;
  tituloNome: string;
  dtLocacao: string;
  dtDevolucaoPrevista: string;
  dtDevolucaoEfetiva: string | null;
  estahPaga: boolean;
};

export const columns: ColumnDef<Rental>[] = [
  // SELECT BOX
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex justify-start">
        <Checkbox
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-start">
        <Checkbox
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          checked={row.getIsSelected()}
        />
      </div>
    ),
    size: 20,
  },

  // CLIENTE
  {
    accessorKey: "clienteNome",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 hover:bg-transparent justify-start font-medium"
      >
        Cliente
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-left pl-3">{row.getValue("clienteNome")}</div>
    ),
    size: 200,
  },

  // TÍTULO
  {
    accessorKey: "tituloNome",
    header: () => <div className="text-left font-medium">Título</div>,
    cell: ({ row }) => (
      <div className="text-left pl-3">{row.getValue("tituloNome")}</div>
    ),
    size: 200,
  },

  // DATA LOCAÇÃO
  {
    accessorKey: "dtLocacao",
    header: () => <div className="text-center font-medium">Locação</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("dtLocacao")}</div>
    ),
  },

  // DATA PREVISTA
  {
    accessorKey: "dtDevolucaoPrevista",
    header: () => <div className="text-center font-medium">Prevista</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("dtDevolucaoPrevista")}
      </div>
    ),
  },

  // DATA EFETIVA
  {
    accessorKey: "dtDevolucaoEfetiva",
    header: () => <div className="text-center font-medium">Devolução</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("dtDevolucaoEfetiva") || "—"}
      </div>
    ),
  },

  // STATUS
  {
    accessorKey: "estahPaga",
    header: () => <div className="text-center font-medium">Pagamento</div>,
    cell: ({ row }) => {
      const paid = row.getValue("estahPaga") as boolean;
      return (
        <div
          className={`text-center font-semibold ${
            paid ? "text-green-600" : "text-red-600"
          }`}
        >
          {paid ? "Pago" : "Pendente"}
        </div>
      );
    },
    size: 80,
  },

  // AÇÕES
{
  id: "actions",
  header: () => <div className="text-center font-medium">Ações</div>,
  cell: ({ row }) => {
    const rental = row.original;

    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isPaying, setIsPaying] = useState(false);

    const isReturned = rental.dtDevolucaoEfetiva !== null;
    const canPay = isReturned && !rental.estahPaga; // 👈 NOVA REGRA

    const handleDelete = async (id: number) => {
      setIsDeleting(true);

      try {
        const response = await fetch(
          `http://localhost:8081/api/locacoes/${id}`,
          { method: "DELETE" }
        );

        if (!response.ok) throw new Error("Erro ao excluir locação");

        window.location.reload();
      } catch (e) {
        alert("Erro ao excluir locação");
      } finally {
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
      }
    };

    const handlePayment = async (id: number) => {
      setIsPaying(true);

      try {
        const response = await fetch(
          `http://localhost:8081/api/locacoes/${id}/pagar`,
          { method: "PUT" }
        );

        if (!response.ok) throw new Error("Erro ao confirmar pagamento");

        window.location.reload();
      } catch (e) {
        alert("Erro ao confirmar pagamento");
      } finally {
        setIsPaying(false);
      }
    };

    return (
      <div className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>

            {/* EDITAR — só aparece se AINDA NÃO foi devolvida */}
            {!isReturned && (
              <DropdownMenuItem asChild>
                <EditLocation rental={rental}>
                  <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-sm">
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar locação
                  </button>
                </EditLocation>
              </DropdownMenuItem>
            )}

            {/* CONFIRMAR PAGAMENTO — só aparece se devolvida e não paga */}
            {canPay && (
              <DropdownMenuItem
                onClick={() => handlePayment(rental.id)}
                disabled={isPaying}
              >
                <DollarSign className="h-4 w-4" />
                {isPaying ? "Confirmando..." : "Confirmar pagamento"}
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            {/* EXCLUIR */}
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? "Excluindo..." : "Excluir locação"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DeleteGeneric
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Excluir locação?"
          description="Tem certeza que deseja excluir esta locação? Essa ação não pode ser desfeita."
          confirmLabel="Sim, excluir"
          cancelLabel="Cancelar"
          onConfirm={() => handleDelete(rental.id)}
          isDeleting={isDeleting}
        />
      </div>
    );
  },
  size: 80,
},
];
