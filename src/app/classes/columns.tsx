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
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export type Classe = {
  id: string;
  name: string;
  value: number;
  returnDate: string;
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
    accessorKey: "returnDate",
    header: () => <div className="text-center font-medium">Data Devolução</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("returnDate"));
      return <div className="text-center">{date.toLocaleDateString("pt-BR")}</div>;
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
                onClick={() => navigator.clipboard.writeText(classe.id)}
              >
                Copiar ID da classe
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Editar classe</DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                disabled={classe.titleCount > 0}
              >
                {classe.titleCount > 0 ? "Não pode excluir" : "Excluir classe"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    size: 60,
  },
];