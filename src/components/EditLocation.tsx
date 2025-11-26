"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmationAlert } from "@/components/ConfirmationAlert";

const API_BASE_URL = "http://localhost:8081/api";

// --- SCHEMA ---
const formSchema = z.object({
  dtLocacao: z.string().min(1, "Data da locação obrigatória"),
  dtDevolucaoPrevista: z.string().min(1, "Data prevista obrigatória"),
  clienteId: z.string().min(1, "Selecione um cliente"),
  itemId: z.string().min(1, "Selecione um item"),
});

type FormData = z.infer<typeof formSchema>;

interface Cliente {
  id: number;
  nome: string;
}

interface Item {
  id: number;
  numeroSerie: string;
}

interface RentalProps {
  children?: React.ReactNode;
  rental: any;
  onUpdated?: () => void;
}

export default function EditLocation({ children, rental, onUpdated }: RentalProps) {
  const router = useRouter();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [itens, setItens] = useState<Item[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dtLocacao: "",
      dtDevolucaoPrevista: "",
      clienteId: "",
      itemId: "",
    },
  });

  // --- CARREGA CLIENTES E ITENS ---
  useEffect(() => {
    if (!sheetOpen) return;

    const fetchAll = async () => {
      setLoadingData(true);
      try {
        const [clientesRes, itensRes, locacaoRes] = await Promise.all([
          fetch(`${API_BASE_URL}/clientes`),
          fetch(`${API_BASE_URL}/itens`),
          fetch(`${API_BASE_URL}/locacoes/${rental.id}`),
        ]);

        const clientesData = await clientesRes.json();
        const itensData = await itensRes.json();
        const locacaoData = await locacaoRes.json();

        setClientes(clientesData);
        setItens(itensData);

        // --- PREENCHE O FORM COM OS DADOS DA LOCAÇÃO ---
        form.reset({
          dtLocacao: locacaoData.dtLocacao || "",
          dtDevolucaoPrevista: locacaoData.dtDevolucaoPrevista || "",
          clienteId: String(locacaoData.clienteId || ""),
          itemId: String(locacaoData.itemId || ""),
        });
      } catch (err) {
        console.error("Erro ao carregar dados", err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchAll();
  }, [sheetOpen, rental.id, form]);

  const handleSubmit = async (values: FormData) => {
    try {
      setIsLoading(true);

      const payload = {
        dtLocacao: values.dtLocacao,
        dtDevolucaoPrevista: values.dtDevolucaoPrevista,
        clienteId: parseInt(values.clienteId),
        itemId: parseInt(values.itemId),
      };

      const response = await fetch(`${API_BASE_URL}/locacoes/${rental.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erro ao atualizar locação");

      setStatus("success");
      setSheetOpen(false);
      onUpdated?.();
      router.refresh();
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>

        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="mb-4">Editar Locação</SheetTitle>

            <SheetDescription asChild>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="dtLocacao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data da Locação</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dtDevolucaoPrevista"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data Prevista de Devolução</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clienteId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cliente</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={loadingData}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um cliente" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {clientes.map((c) => (
                              <SelectItem key={c.id} value={String(c.id)}>
                                {c.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="itemId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={loadingData}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um item" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {itens.map((i) => (
                              <SelectItem key={i.id} value={String(i.id)}>
                                {i.numeroSerie}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSheetOpen(false)}
                      disabled={isLoading}
                    >
                      Cancelar
                    </Button>

                    <Button type="submit" disabled={isLoading || loadingData}>
                      {isLoading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </div>
                </form>
              </Form>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <ConfirmationAlert
        open={status !== "idle"}
        onOpenChange={(o) => !o && setStatus("idle")}
        type={status === "success" ? "success" : "error"}
        title={
          status === "success"
            ? "Locação atualizada com sucesso!"
            : "Erro ao atualizar locação!"
        }
        description={
          status === "success"
            ? "As alterações foram salvas no sistema."
            : "Verifique os dados e tente novamente."
        }
        onClose={() => setStatus("idle")}
      />
    </>
  );
}
