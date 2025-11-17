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

export type Client = {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  isActive: boolean;
  dependentsCount: number;
};

export const columns: ColumnDef<Client>[] = [
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
    size: 10,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
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
    ),
    cell: ({ row }) => (
      <div className="text-left pl-3">{row.getValue("name")}</div>
    ),
    size: 200,
  },
  {
    accessorKey: "cpf",
    header: () => <div className="text-left font-medium">CPF</div>,
    cell: ({ row }) => <div className="text-left pl-3">{row.getValue("cpf")}</div>,
    size: 200,
  },
  {
    accessorKey: "phone",
    header: () => <div className="text-left font-medium">Telefone</div>,
    cell: ({ row }) => (
      <div className="text-left pl-3">{row.getValue("phone")}</div>
    ),
  },
  {
    accessorKey: "dependentsCount",
    header: () => <div className="text-center font-medium">Dependentes</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("dependentsCount")}</div>
    ),
    size: 50,
  },
  {
    accessorKey: "isActive",
    header: () => <div className="text-center font-medium">Situação</div>,
    cell: ({ row }) => {
      const active = row.getValue("isActive") as boolean;
      return (
        <div
          className={`text-center font-semibold ${
            active ? "text-green-600" : "text-red-600"
          }`}
        >
          {active ? "Ativo" : "Inativo"}
        </div>
      );
    },
    size: 50,
  },
  {
    id: "actions",
    header: () => <div className="text-center font-medium">Ações</div>,
    cell: ({ row }) => {
      const client = row.original;

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
                onClick={() => navigator.clipboard.writeText(client.id)}
              >
                Copiar ID
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem>Editar cliente</DropdownMenuItem>

              <DropdownMenuItem className="text-red-600">
                Excluir cliente
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    size: 60,
  },
];
