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
    size: 10,
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
      return (
        <div className="text-center">{v ? v.toString() : "—"}</div>
      );
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
    size: 50,
  },

  {
    id: "actions",
    header: () => <div className="text-center font-medium">Ações</div>,
    cell: ({ row }) => {
      const rental = row.original;

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
                Copiar ID
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem>Editar locação</DropdownMenuItem>

              <DropdownMenuItem className="text-red-600">
                Cancelar locação
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    size: 60,
  },
];
