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
import { ArrowUpDown, MoreHorizontal, Copy, Trash2 } from "lucide-react";
import EditClass from "@/components/EditClass";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { DeleteGeneric } from "@/components/DeleteGeneric";

export type Classe = {
  id: string;
  name: string;
  value: number;
  prazoDevolucao: number;
  titleCount: number;
};

export const columns: ColumnDef<Classe>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex justify-start">
        <Checkbox
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          checked={row.getIsSelected()}
        />
      </div>
    ),
    size: 10,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="text-left">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent justify-start font-medium"
          >
            Nome
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="text-left pl-3">{row.getValue("name")}</div>;
    },
    size: 220,
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent font-medium"
          >
            Valor
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("value"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);

      return <div className="text-center">{formatted}</div>;
    },
    size: 150,
  },
  {
    accessorKey: "prazoDevolucao",
    header: () => <div className="text-center font-medium">Prazo Devolução (dias)</div>,
    cell: ({ row }) => {
      const prazo = row.getValue("prazoDevolucao");
      return <div className="text-center">{prazo as number}</div>;
    },
    size: 150,
  },
  {
    accessorKey: "titleCount",
    header: () => <div className="text-center font-medium">Títulos</div>,
    cell: ({ row }) => {
      const titleCount = row.getValue("titleCount");
      return <div className="text-center">{titleCount as number}</div>;
    },
    size: 150,
  },
  {
    id: "actions",
    header: () => <div className="text-center font-medium">Ações</div>,
    cell: ({ row }) => {
      const classe = row.original;
      const [isDeleting, setIsDeleting] = useState(false);
      const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

      const handleDelete = async (id: string) => {
        setIsDeleting(true);
        try {
          const response = await fetch(`http://localhost:8081/api/classes/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) throw new Error("Erro ao excluir ator");


          window.location.reload();
        } catch (error) {
          alert("Erro ao excluir ator");
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
                onClick={() => navigator.clipboard.writeText(classe.id)}>
                <Copy className="mr-2 h-4 w-4" />
                Copiar ID
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <EditClass
                  classe={classe}
                  onClassUpdated={() => window.location.reload()}>
                  <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-sm">
                    <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
                    Editar Classe
                  </button>
                </EditClass>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={classe.titleCount > 0 || isDeleting}>
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? "Excluindo..." : "Excluir classe"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DeleteGeneric
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title="Excluir classe?"
            description="Tem certeza que deseja excluir este classe? Essa ação não pode ser desfeita."
            confirmLabel="Sim, excluir"
            cancelLabel="Cancelar"
            onConfirm={() => handleDelete(classe.id)}
            isDeleting={isDeleting}
          />
        </div>
      );
    },
    size: 60,
  },
];