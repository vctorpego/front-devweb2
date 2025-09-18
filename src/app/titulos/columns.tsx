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

export type Title = {
  id: string;
  name: string;
  director: string;
  year: number;
  category: string;
  className: string;
  itemCount: number;
};

export const columns: ColumnDef<Title>[] = [
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
    size: 20,
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
            Título
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="text-left pl-3">{row.getValue("name")}</div>;
    },
    size: 250,
  },
  {
    accessorKey: "director",
    header: () => <div className="text-left font-medium">Diretor</div>,
    cell: ({ row }) => {
      return <div className="text-left">{row.getValue("director")}</div>;
    },
    size: 150,
  },
  {
    accessorKey: "year",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent font-medium"
          >
            Ano
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div> 
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("year")}</div>;
    },
    size: 100,
  },
  {
    accessorKey: "category",
    header: () => <div className="text-left font-medium">Categoria</div>,
    cell: ({ row }) => {
      return <div className="text-left">{row.getValue("category")}</div>;
    },
    size: 100,
  },
  {
    accessorKey: "className",
    header: () => <div className="text-left font-medium">Classe</div>,
    cell: ({ row }) => {
      return <div className="text-left">{row.getValue("className")}</div>;
    },
    size: 100,
  },
  {
    accessorKey: "itemCount",
    header: () => <div className="text-center font-medium">Itens</div>,
    cell: ({ row }) => {
      const itemCount = row.getValue("itemCount");
      return <div className="text-center">{itemCount as number}</div>;
    },
    size: 80,
  },
  {
    id: "actions",
    header: () => <div className="text-center font-medium">Ações</div>,
    cell: ({ row }) => {
      const title = row.original;

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
                onClick={() => navigator.clipboard.writeText(title.id)}
              >
                Copiar ID do título
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Visualizar título
              </DropdownMenuItem>
              <DropdownMenuItem>
                Editar título
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                disabled={title.itemCount > 0}
              >
                {title.itemCount > 0 ? "Não pode excluir" : "Excluir título"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    size: 80,
  },
];