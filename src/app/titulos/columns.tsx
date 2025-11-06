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
import { ArrowUpDown, MoreHorizontal, Copy, Trash2, Eye, Pencil } from "lucide-react";
import { useState } from "react";
import EditTitle from "@/components/EditTitle";
import { DeleteGeneric } from "@/components/DeleteGeneric";
import Link from "next/link";

export type Title = {
  id: string;
  name: string;
  director: string;
  year: number;
  category: string;
  className: string;
  itemCount: number;
  // Campos adicionais para o EditTitle
  nome?: string;
  nomeOriginal?: string;
  sinopse?: string;
  diretorId?: number;
  classeId?: number;
  atoresIds?: number[];
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
      const title = row.original;
      return (
        <Link 
          href={`/titulos/${title.id}`}
          className="text-left pl-3 hover:text-blue-600 hover:underline"
        >
          {row.getValue("name")}
        </Link>
      );
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
      const [isDeleting, setIsDeleting] = useState(false);
      const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
      const [fullTitleData, setFullTitleData] = useState(null);
      const [isLoadingFullData, setIsLoadingFullData] = useState(false);

      // Função para buscar dados completos do título
      const fetchFullTitleData = async (id: string) => {
        try {
          setIsLoadingFullData(true);
          const response = await fetch(`http://localhost:8080/api/titulos/${id}`);
          if (!response.ok) throw new Error("Erro ao buscar dados completos");
          const data = await response.json();
          setFullTitleData(data);
          return data;
        } catch (error) {
          console.error("Erro ao buscar dados completos:", error);
          return null;
        } finally {
          setIsLoadingFullData(false);
        }
      };

      const handleDelete = async (id: string) => {
        setIsDeleting(true);
        try {
          const response = await fetch(`http://localhost:8080/api/titulos/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) throw new Error("Erro ao excluir título");

          window.location.reload();
        } catch (error) {
          alert("Erro ao excluir título");
        } finally {
          setIsDeleting(false);
          setIsDeleteModalOpen(false);
        }
      };

      // Dados básicos para o EditTitle (fallback)
      const editTitleData = {
        id: title.id,
        nome: title.nome || title.name || "",
        nomeOriginal: title.nomeOriginal || title.name || "",
        ano: title.year,
        sinopse: title.sinopse || "",
        categoria: title.category,
        diretorId: title.diretorId || 0,
        classeId: title.classeId || 0,
        atoresIds: title.atoresIds || [],
        // Campos extras para ajudar no mapeamento
        director: title.director,
        className: title.className
      };

      // Usar dados completos se disponíveis
      const titleToEdit = fullTitleData || editTitleData;

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
                onClick={() => navigator.clipboard.writeText(title.id)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copiar ID
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href={`/titulos/${title.id}`}>
                  <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-sm">
                    <Eye className="h-4 w-4" />
                    Visualizar Título
                  </button>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <EditTitle
                  title={{
                    id: title.id,
                    nome: title.name,
                    nomeOriginal: title.nomeOriginal || title.name,
                    ano: title.year,
                    sinopse: title.sinopse || "Sinopse temporária",
                    categoria: title.category,
                    diretorId: title.diretorId || 1,
                    classeId: title.classeId || 1,
                    atoresIds: title.atoresIds || []
                  }}
                  onTitleUpdated={() => window.location.reload()}
                >
                  <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-sm">
                    <Pencil className="h-4 w-4" />
                    Editar Título
                  </button>
                </EditTitle>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={title.itemCount > 0 || isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? "Excluindo..." : "Excluir título"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DeleteGeneric
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title="Excluir titulo?"
            description="Tem certeza que deseja excluir este titulo? Essa ação não pode ser desfeita."
            confirmLabel="Sim, excluir"
            cancelLabel="Cancelar"
            onConfirm={() => handleDelete(title.id)}
            isDeleting={isDeleting}
          />
        </div>
      );
    },
    size: 80,
  },
];