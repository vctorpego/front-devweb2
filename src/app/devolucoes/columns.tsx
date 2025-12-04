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


export type Return = {
  id: string; 
  itemNumber: string;       
  itemTitle: string;        
  clientName: string;      
  rentalDate: string;       
  expectedReturn: string;    
  actualReturn: string | null;
  lateFee: number;
  totalValue: number;
  isLate: boolean;
};

export const columns: ColumnDef<Return>[] = [
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
  },

  {
    accessorKey: "itemNumber",
    header: "Nº Série",
    cell: ({ row }) => row.getValue("itemNumber") || "—",
  },

  {
    accessorKey: "itemTitle",
    header: "Título",
    cell: ({ row }) => row.getValue("itemTitle") || "—",
  },

  {
    accessorKey: "clientName",
    header: "Cliente",
    cell: ({ row }) => row.getValue("clientName") || "—",
  },

  {
    accessorKey: "rentalDate",
    header: "Locação",
    cell: ({ row }) => {
      const date = row.getValue("rentalDate") as string;
      return new Date(date).toLocaleDateString("pt-BR");
    },
  },

  {
    accessorKey: "expectedReturn",
    header: "Prevista",
    cell: ({ row }) => {
      const date = row.getValue("expectedReturn") as string;
      return new Date(date).toLocaleDateString("pt-BR");
    },
  },

  {
    accessorKey: "actualReturn",
    header: "Devolução",
    cell: ({ row }) => {
      const date = row.getValue("actualReturn") as string | null;
      return date ? new Date(date).toLocaleDateString("pt-BR") : "Pendente";
    },
  },

  {
    accessorKey: "lateFee",
    header: "Multa",
    cell: ({ row }) => {
      const multa = Number(row.getValue("lateFee"));
      return `R$ ${multa.toFixed(2)}`;
    },
  },

  {
    header: "Total",
    cell: ({ row }) => {
      const valor = row.original.totalValue ?? 0;
      const multa = row.original.lateFee ?? 0;
      return `R$ ${(valor + multa).toFixed(2)}`;
    },
  },

  // Ações
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const ret = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(ret.id.toString())}
            >
              Copiar ID
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>Ver detalhes</DropdownMenuItem>

            <DropdownMenuItem className="text-red-600">
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
