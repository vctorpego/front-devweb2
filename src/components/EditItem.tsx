"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeedbackAlert } from "@/components/FeedbackAlert";

// --- SCHEMA ---
const formSchema = z.object({
  numeroSerie: z.string().min(1, "Número de série obrigatório"),
  dataAquisicao: z.string().min(1, "Data obrigatória"),
  tipo: z.enum(["DVD", "BLURAY", "FITA"]),
  tituloId: z.string().min(1, "Título obrigatório"),
});

type FormData = z.infer<typeof formSchema>;

interface Titulo {
  id: string;
  nome: string;
}

interface EditItemProps {
  children?: React.ReactNode;
  item: any;
  onItemUpdated?: () => void;
}

const API_BASE_URL = "http://localhost:8080/api";

export default function EditItem({ children, item, onItemUpdated }: EditItemProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [titulos, setTitulos] = useState<Titulo[]>([]);
  const [loadingTitulos, setLoadingTitulos] = useState(false);
  const [itemCompleto, setItemCompleto] = useState<any>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [status, setStatus] = useState<"success" | "error" | "">("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numeroSerie: "",
      dataAquisicao: "",
      tipo: "DVD",
      tituloId: "",
    },
  });

  // Testa conexão com backend
  const testConnection = async (endpoint: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      return response.ok;
    } catch {
      return false;
    }
  };

  // Buscar item completo
  useEffect(() => {
    if (!open || !item?.id) return;

    const fetchItemCompleto = async () => {
      setConnectionError(null);

      const isConnected = await testConnection("/itens/1");
      if (!isConnected) {
        setConnectionError("Backend não está respondendo. Verifique o servidor na porta 8080.");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/itens/${item.id}`);
        if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
        const data = await response.json();
        setItemCompleto(data);
      } catch (error) {
        setConnectionError("Erro ao carregar item: " + (error instanceof Error ? error.message : "Desconhecido"));
      }
    };

    fetchItemCompleto();
  }, [open, item?.id]);

  // Buscar títulos
  useEffect(() => {
    if (!open) return;

    const fetchTitulos = async () => {
      setLoadingTitulos(true);
      setConnectionError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/titulos`);
        if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
        const data = await response.json();
        setTitulos(data);
      } catch (error) {
        setConnectionError("Erro ao carregar títulos: " + (error instanceof Error ? error.message : "Desconhecido"));
      } finally {
        setLoadingTitulos(false);
      }
    };

    fetchTitulos();
  }, [open]);

  // Preencher form com dados do item
  useEffect(() => {
    if (!open || !itemCompleto) return;

    const today = new Date().toISOString().split("T")[0];
    const numeroSerie = item.serialNumber || itemCompleto.numeroSerie || "";
    const tituloId = String(itemCompleto.tituloId || itemCompleto.titulo?.id || "");
    const tipo = String(itemCompleto.tipo || "DVD").toUpperCase() as "DVD" | "BLURAY" | "FITA";

    form.reset({
      numeroSerie,
      dataAquisicao: today,
      tipo,
      tituloId,
    });
  }, [open, itemCompleto, item.serialNumber, form]);

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    setConnectionError(null);
    try {
      const tituloSelecionado = titulos.find(t => t.id === data.tituloId);
      if (!data.tituloId || !tituloSelecionado) throw new Error("Selecione um título válido");

      const payload = {
        numeroSerie: data.numeroSerie,
        dataAquisicao: data.dataAquisicao,
        tipo: data.tipo,
        tituloId: Number(data.tituloId),
        tituloNome: tituloSelecionado.nome,
      };

      const response = await fetch(`${API_BASE_URL}/itens/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Erro ${response.status}: ${response.statusText}`);
      }

      // Mostra alerta de sucesso
      setStatus("success");
      form.reset();

      setTimeout(() => {
        setStatus("");
        setOpen(false);
        onItemUpdated?.();
      }, 2000);

    } catch (error) {
      setStatus("error");
      setConnectionError("Erro ao atualizar item: " + (error instanceof Error ? error.message : "Desconhecido"));
      setTimeout(() => setStatus(""), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentTituloNome = () => {
    const currentItem = itemCompleto || item;
    if (!currentItem) return "Carregando...";
    if (currentItem.titulo?.nome) return currentItem.titulo.nome;
    if (currentItem.tituloNome) return currentItem.tituloNome;
    const currentTituloId = currentItem.tituloId || currentItem.titulo?.id;
    if (currentTituloId && titulos.length > 0) {
      return titulos.find(t => t.id === String(currentTituloId))?.nome || "Selecione um título";
    }
    return "Selecione um título";
  };

  return (
    <>
      {/* ALERTA CENTRALIZADO - IGUAL AOS OUTROS COMPONENTES */}
      {status &&
        createPortal(
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg shadow-lg w-[380px] flex flex-col items-center text-center">
              <FeedbackAlert
                type={status}
                title={
                  status === "success"
                    ? "Alterações salvas com sucesso!"
                    : "Erro ao salvar alterações!"
                }
                description={
                  status === "success"
                    ? "O item foi atualizado no sistema."
                    : "Verifique os dados e tente novamente."
                }
              />
            </div>
          </div>,
          document.body
        )}

      <div onClick={() => setOpen(true)}>{children}</div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Editar Item</SheetTitle>
            <SheetDescription>
              {itemCompleto ? "Atualize as informações do item selecionado." : "Carregando item..."}
            </SheetDescription>
          </SheetHeader>

          {connectionError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm mb-4">
              {connectionError}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="numeroSerie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Série</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: SN010" {...field} disabled={!itemCompleto || !!connectionError} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataAquisicao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Aquisição</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={!itemCompleto || !!connectionError} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!itemCompleto || !!connectionError}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DVD">DVD</SelectItem>
                        <SelectItem value="BLURAY">Blu-ray</SelectItem>
                        <SelectItem value="FITA">FITA</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tituloId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={loadingTitulos || !itemCompleto || !!connectionError}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={getCurrentTituloNome()} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {titulos.map((titulo) => (
                          <SelectItem key={titulo.id} value={String(titulo.id)}>
                            {titulo.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading || loadingTitulos || !itemCompleto || !!connectionError}>
                  {isLoading ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
}