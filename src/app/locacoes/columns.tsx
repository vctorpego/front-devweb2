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
  Copy,
  Trash2,
  Pencil,
  Eye,
} from "lucide-react";

import { useState } from "react";
import EditLocation from "@/components/EditLocation";
import { DeleteGeneric } from "@/components/DeleteGeneric";

export type Rental = {
  id: string;
  clientName: string;
  itemTitle: string;
  rentalDate: string;
  expectedReturn: string;
  actualReturn: string | null;
  isPaid: boolean;
};

export const columns: ColumnDef<Rental>[] = [
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

  {
    accessorKey: "clientName",
    header: ({ column }) => (
      <div className="text-left">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent justify-start font-medium"
        >
          Cliente
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-left pl-3">{row.getValue("clientName")}</div>
    ),
    size: 200,
  },

  {
    accessorKey: "itemTitle",
    header: () => <div className="text-left font-medium">Item</div>,
    cell: ({ row }) => (
      <div className="text-left pl-3">{row.getValue("itemTitle")}</div>
    ),
    size: 200,
  },

  {
    accessorKey: "rentalDate",
    header: () => <div className="text-center font-medium">Locação</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("rentalDate")}</div>
    ),
  },

  {
    accessorKey: "expectedReturn",
    header: () => <div className="text-center font-medium">Prevista</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("expectedReturn")}</div>
    ),
  },

  {
    accessorKey: "actualReturn",
    header: () => <div className="text-center font-medium">Devolução</div>,
    cell: ({ row }) => {
      const v = row.getValue("actualReturn");
      return <div className="text-center">{v ? v.toString() : "—"}</div>;
    },
  },

  {
    accessorKey: "isPaid",
    header: () => <div className="text-center font-medium">Pagamento</div>,
    cell: ({ row }) => {
      const paid = row.getValue("isPaid") as boolean;
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

  // ---------------------------------
  // AÇÕES
  // ---------------------------------
  {
    id: "actions",
    header: () => <div className="text-center font-medium">Ações</div>,
    cell: ({ row }) => {
      const rental = row.original;

      const [isDeleting, setIsDeleting] = useState(false);
      const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

      const handleDelete = async (id: string) => {
        setIsDeleting(true);

        try {
          const response = await fetch(
            `http://localhost:8080/api/locacoes/${id}`,
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

      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(rental.id)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copiar ID
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* EDITAR */}
              <DropdownMenuItem asChild>
                <EditLocation rental={rental}>
                  <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-sm">
                    <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
                    Editar Locação
                  </button>
                </EditLocation>
              </DropdownMenuItem>

              {/* DELETAR */}
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

          {/* MODAL DE CONFIRMAÇÃO */}
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
