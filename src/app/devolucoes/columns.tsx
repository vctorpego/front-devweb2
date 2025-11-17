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
  actualReturn: string;
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
    size: 10,
  },

  {
    accessorKey: "itemNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 hover:bg-transparent justify-start font-medium"
      >
        Nº Série
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="pl-3">{row.getValue("itemNumber")}</div>,
  },

  {
    accessorKey: "itemTitle",
    header: () => <div className="font-medium">Título</div>,
    cell: ({ row }) => <div className="pl-3">{row.getValue("itemTitle")}</div>,
  },

  {
    accessorKey: "clientName",
    header: () => <div className="font-medium">Cliente</div>,
    cell: ({ row }) => <div className="pl-3">{row.getValue("clientName")}</div>,
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
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("actualReturn") || "—"}
      </div>
    ),
  },

  {
    accessorKey: "lateFee",
    header: () => <div className="text-center font-medium">Multa</div>,
    cell: ({ row }) => (
      <div className="text-center">
        R$ {Number(row.getValue("lateFee")).toFixed(2)}
      </div>
    ),
  },

  {
    accessorKey: "totalValue",
    header: () => <div className="text-center font-medium">Total</div>,
    cell: ({ row }) => (
      <div className="text-center">
        R$ {Number(row.getValue("totalValue")).toFixed(2)}
      </div>
    ),
  },

  {
    accessorKey: "isLate",
    header: () => <div className="text-center font-medium">Atraso</div>,
    cell: ({ row }) => {
      const late = row.getValue("isLate") as boolean;
      return (
        <div
          className={`text-center font-semibold ${
            late ? "text-red-600" : "text-green-600"
          }`}
        >
          {late ? "Atrasada" : "Normal"}
        </div>
      );
    },
  },

  {
    id: "actions",
    header: () => <div className="text-center font-medium">Ações</div>,
    cell: ({ row }) => {
      const ret = row.original;

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
                onClick={() => navigator.clipboard.writeText(ret.id)}
              >
                Copiar ID
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem>Ver detalhes</DropdownMenuItem>

              <DropdownMenuItem className="text-red-600">
                Excluir registro
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
