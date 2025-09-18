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
import { ArrowUpDown, MoreHorizontal, Eye } from "lucide-react";

export type Item = {
  id: string;
  serialNumber: string;
  title: string;
  acquisitionDate: string;
  type: "fita" | "dvd" | "bluray";
  rentalCount: number;
  status: "available" | "unavailable";
};

export const columns: ColumnDef<Item>[] = [
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
    accessorKey: "serialNumber",
    header: ({ column }) => {
      return (
        <div className="text-left">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent justify-start font-medium"
          >
            Nº Série
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="text-left pl-3">{row.getValue("serialNumber")}</div>;
    },
    size: 120,
  },
  {
    accessorKey: "title",
    header: () => <div className="text-left font-medium">Título</div>,
    cell: ({ row }) => {
      return <div className="text-left">{row.getValue("title")}</div>;
    },
    size: 200,
  },
  {
    accessorKey: "acquisitionDate",
    header: ({ column }) => {
      return (
        <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent font-medium"
        >
          Aquisição
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("acquisitionDate"));
      return <div className="text-center">{date.toLocaleDateString("pt-BR")}</div>;
    },
    size: 100,
  },
  {
    accessorKey: "type",
    header: () => <div className="text-center font-medium">Tipo</div>,
    cell: ({ row }) => {
      const type = row.getValue("type");
      const typeText = type === "fita" ? "Fita" : type === "dvd" ? "DVD" : "BlueRay";
      return <div className="text-center">{typeText}</div>;
    },
    size: 80,
  },
  {
    accessorKey: "rentalCount",
    header: () => <div className="text-center font-medium">Locações</div>,
    cell: ({ row }) => {
      const rentalCount = row.getValue("rentalCount");
      return <div className="text-center">{rentalCount as number}</div>;
    },
    size: 80,
  },
   {
    accessorKey: "status",
    header: () => <div className="text-center font-medium">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <div className={`text-center text-xs font-medium px-2 py-1 rounded-full ${
          status === "available" 
            ? "bg-green-200 text-green-800" 
            : "bg-red-200 text-red-800"
        }`}>
          {status === "available" ? "Disponível" : "Indisponível"}
        </div>
      );
    },
    size: 100,
  },
  {
    id: "actions",
    header: () => <div className="text-center font-medium">Ações</div>,
    cell: ({ row }) => {
      const item = row.original;

      return (
        <div className="flex justify-center space-x-1">
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
                onClick={() => navigator.clipboard.writeText(item.id)}
              >
                Copiar ID do item
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Editar item
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                disabled={item.rentalCount > 0}
              >
                {item.rentalCount > 0 ? "Não pode excluir" : "Excluir item"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    size: 80,
  },
];