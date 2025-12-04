"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Copy, Trash2, Pencil, UserX, UserCheck } from "lucide-react";
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
import { useState } from "react";
import EditClients from "@/components/EditClients";
import { DeleteGeneric } from "@/components/DeleteGeneric";
import { ConfirmationAlert } from "@/components/ConfirmationAlert";

export type Client = {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  dependentsCount: number;
  estahAtivo: boolean; 
  tipoCliente: string; 
  dtNascimento: string;
  sexo: "MASCULINO" | "FEMININO";
  endereco: string;
  socioId?: string;
  numInscricao: string;
};

export const columns: ColumnDef<Client>[] = [
  // SELECT
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
          aria-label="Selecionar todos"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-start">
        <Checkbox
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          checked={row.getIsSelected()}
          aria-label="Selecionar linha"
        />
      </div>
    ),
    size: 10,
  },

  // NAME
  {
    accessorKey: "nome",
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
    cell: ({ row }) => <div className="text-left pl-3">{row.getValue("nome")}</div>,
    size: 220,
  },

  // TIPO
  {
    accessorKey: "tipoCliente",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent font-medium"
        >
          Tipo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const tipoCliente = row.original.tipoCliente;
      const badgeClass =
        tipoCliente === "Sócio"
          ? "bg-blue-200 text-blue-800"
          : "bg-purple-200 text-purple-800";

      return (
        <div className="w-full flex justify-center">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
            {tipoCliente}
          </span>
        </div>
      );
    },
    size: 110,
  },

  // CPF
  {
    accessorKey: "cpf",
    header: ({ column }) => (
      <div className="text-left">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent font-medium"
        >
          CPF
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div className="text-left pl-3">{row.getValue("cpf")}</div>,
    size: 180,
  },

  // TELEFONE
  {
    accessorKey: "telefone",
    header: ({ column }) => (
      <div className="text-left">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent font-medium"
        >
          Telefone
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div className="text-left pl-3">{row.getValue("telefone")}</div>,
    size: 160,
  },

  // DEPENDENTES
  {
    accessorKey: "dependentsCount",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent font-medium"
        >
          Dependentes
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.original.dependentsCount}</div>
    ),
    size: 120,
  },

  // STATUS
  {
    accessorKey: "estahAtivo",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent font-medium"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const ativo = row.original.estahAtivo;
      const badgeClass = ativo ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800";
      return (
        <div className="w-full flex justify-center">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
            {ativo ? "Ativo" : "Inativo"}
          </span>
        </div>
      );
    },
    size: 120,
  },

  // ACTIONS
  {
    id: "actions",
    header: () => <div className="text-center font-medium">Ações</div>,
    cell: ({ row }) => {
      const client = row.original;
      const [isDeleting, setIsDeleting] = useState(false);
      const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
      const [isLoadingStatus, setIsLoadingStatus] = useState(false);
      const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

      // Funções de Desativar/Reativar
      const handleToggleStatus = async () => {
        setIsLoadingStatus(true);
        try {
          const isSocio = client.tipoCliente === "Sócio";

          const clientId =
            client.id.startsWith("s-") || client.id.startsWith("d-")
              ? client.id.substring(2)
              : client.id;

          let endpoint;
          let body = null;

          // SE FOR SÓCIO
          if (isSocio) {
            if (client.estahAtivo) {
              // Sócio ativo → desativar sócio + dependentes
              endpoint = `http://localhost:8081/api/socios/${clientId}/desativar`;
            } else {
              // Sócio inativo → reativar sócio + até 3 dependentes
              endpoint = `http://localhost:8081/api/socios/${clientId}/reativar`;
            }

            // ⛔ IMPORTANTE: Sócios NÃO usam body nesses endpoints especiais
          }

          // SE FOR DEPENDENTE
          else {
            if (client.estahAtivo) {
              // dependente ativo → DESATIVAR
              endpoint = `http://localhost:8081/api/dependentes/${Number(clientId)}/desativar`;
            } else {
              // dependente inativo → REATIVAR
              endpoint = `http://localhost:8081/api/dependentes/${Number(clientId)}/reativar`;
            }

            // dependente não envia body
          }

          const response = await fetch(endpoint, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            ...(body ? { body: JSON.stringify(body) } : {}), // Só envia body se existir
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ${response.status}: ${errorText}`);
          }

          setStatus("success");
          setTimeout(() => window.location.reload(), 1500);

        } catch (err) {
          console.error("Erro:", err);
          setStatus("error");
        } finally {
          setIsLoadingStatus(false);
        }
      };

      // Função de Excluir
      const handleDelete = async (id: string) => {
        setIsDeleting(true);
        try {
          const isSocio = client.tipoCliente === "Sócio";
          const endpoint = isSocio
            ? `http://localhost:8080/api/socios/${id}`
            : `http://localhost:8080/api/dependentes/${id}`;

          const res = await fetch(endpoint, {
            method: "DELETE",
          });
          
          if (!res.ok) throw new Error("Erro ao excluir");
          window.location.reload();
        } catch (err) {
          console.error(err);
          alert("Erro ao excluir cliente");
        } finally {
          setIsDeleting(false);
          setIsDeleteModalOpen(false);
        }
      };

      return (
        <>
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

                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(client.id)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar ID
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* EDITAR */}
                <DropdownMenuItem asChild>
                  <EditClients
                    client={client}
                    onClientUpdated={() => window.location.reload()}
                  >
                    <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-sm">
                      <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
                      Editar Cliente
                    </button>
                  </EditClients>
                </DropdownMenuItem>

                {/* DESATIVAR/REATIVAR */}
                <DropdownMenuItem
                  onClick={handleToggleStatus}
                  disabled={isLoadingStatus}
                  className={client.estahAtivo ? "text-amber-600" : "text-green-600"}
                >
                  {client.estahAtivo ? (
                    <>
                      <UserX className="mr-2 h-4 w-4" />
                      {isLoadingStatus ? "Desativando..." : "Desativar"}
                    </>
                  ) : (
                    <>
                      <UserCheck className="mr-2 h-4 w-4" />
                      {isLoadingStatus ? "Reativando..." : "Reativar"}
                    </>
                  )}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* EXCLUIR */}
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={isDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isDeleting ? "Excluindo..." : "Excluir"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* ALERTA DE RESULTADO - IGUAL AO EDITCLIENTS */}
          <ConfirmationAlert
            open={status !== "idle"}
            onOpenChange={(open) => !open && setStatus("idle")}
            type={status === "success" ? "success" : "error"}
            title={
              status === "success"
                ? client.estahAtivo
                  ? "Cliente desativado!"
                  : "Cliente reativado!"
                : "Erro"
            }
            description={
              status === "success"
                ? client.estahAtivo
                  ? client.tipoCliente === "Sócio"
                    ? "O sócio e seus dependentes foram desativados."
                    : "Dependente desativado com sucesso."
                  : client.tipoCliente === "Sócio"
                    ? "O sócio e até 3 dependentes foram reativados."
                    : "Dependente reativado com sucesso."
                : "Não foi possível alterar o status. Tente novamente."
            }
            onClose={() => setStatus("idle")}
          />

          {/* MODAL DE EXCLUSÃO */}
          <DeleteGeneric
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title="Excluir cliente?"
            description="Tem certeza que deseja excluir este cliente? Essa ação não pode ser desfeita."
            confirmLabel="Sim, excluir"
            cancelLabel="Cancelar"
            onConfirm={() => handleDelete(client.id)}
            isDeleting={isDeleting}
          />
        </>
      );
    },
    size: 80,
  },
];