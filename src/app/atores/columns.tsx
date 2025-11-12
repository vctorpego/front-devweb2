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
import { useState } from "react";
import EditActor from "@/components/EditActor";
import { DeleteGeneric } from "@/components/DeleteGeneric";
import { Pencil } from "lucide-react";

export type Actor = {
  id: string;
  name: string;
  titleCount: number;
};

export const columns: ColumnDef<Actor>[] = [
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
    accessorKey: "titleCount",
    header: () => <div className="text-center font-medium">Títulos</div>,
    cell: ({ row }) => {
      const titleCount = row.getValue("titleCount");
      return <div className="text-center">{titleCount as number}</div>;
    },
    size: 400,
  },
  {
    id: "actions",
    header: () => <div className="text-center font-medium">Ações</div>,
    cell: ({ row }) => {
      const actor = row.original;
      const [isDeleting, setIsDeleting] = useState(false);
      const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

      const handleDelete = async (id: string) => {
        setIsDeleting(true);
        try {
          const response = await fetch(
            `http://localhost:8081/api/atores/${id}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) throw new Error("Erro ao excluir ator");

          window.location.reload();
        } catch (error) {
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
                onClick={() => navigator.clipboard.writeText(actor.id)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copiar ID
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <EditActor
                  actor={actor}
                  onActorUpdated={() => window.location.reload()}
                >
                  <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-sm">
                    <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
                    Editar Ator
                  </button>
                </EditActor>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={actor.titleCount > 0 || isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? "Excluindo..." : "Excluir ator"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteGeneric
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title="Excluir ator?"
            description="Tem certeza que deseja excluir este ator? Essa ação não pode ser desfeita."
            confirmLabel="Sim, excluir"
            cancelLabel="Cancelar"
            onConfirm={() => handleDelete(actor.id)}
            isDeleting={isDeleting}
          />
        </div>
      );
    },
    size: 60,
  },
];