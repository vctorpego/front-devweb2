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

const formSchema = z.object({
  dtLocacao: z.string().min(1),
  dtDevolucaoPrevista: z.string().min(1),
  clienteId: z.string().min(1),
  itemId: z.string().min(1),
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
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dtLocacao: "",
      dtDevolucaoPrevista: "",
      clienteId: "",
      itemId: "",
    },
  });

  // --------------- DEBUG HELPERS ---------------
  // Abra o console do navegador para ver os logs e confirmar o fluxo.
  // Eles ajudam a entender se a primeira chamada foi feita e se os dados chegaram.
  // ----------------------------------------------

  useEffect(() => {
    if (!sheetOpen) return;

    let mounted = true;
    const loadData = async () => {
      setLoading(true);
      console.log("[EditLocation] loadData start - rental.id =", rental?.id);

      try {
        const [clientesRes, itensRes, locacaoRes] = await Promise.all([
          fetch(`${API_BASE_URL}/clientes`),
          fetch(`${API_BASE_URL}/itens`),
          fetch(`${API_BASE_URL}/locacoes/${rental.id}`),
        ]);

        if (!clientesRes.ok) {
          console.error("[EditLocation] clientes fetch failed", clientesRes.status);
          throw new Error("Erro ao carregar clientes");
        }
        if (!itensRes.ok) {
          console.error("[EditLocation] itens fetch failed", itensRes.status);
          throw new Error("Erro ao carregar itens");
        }
        if (!locacaoRes.ok) {
          console.error("[EditLocation] locacao fetch failed", locacaoRes.status);
          throw new Error("Erro ao carregar locação");
        }

        const clientesData = await clientesRes.json();
        const itensData = await itensRes.json();
        const locacaoData = await locacaoRes.json();

        if (!mounted) return;

        console.log("[EditLocation] dados recebidos:", {
          clientes: clientesData.length,
          itens: itensData.length,
          locacao: locacaoData,
        });

        setClientes(clientesData);
        setItens(itensData);

        // Reset do form APÓS tudo carregado
        form.reset({
          dtLocacao: locacaoData.dtLocacao?.split("T")[0] || "",
          dtDevolucaoPrevista: locacaoData.dtDevolucaoPrevista?.split("T")[0] || "",
          clienteId: String(locacaoData.clienteId ?? ""),
          itemId: String(locacaoData.itemId ?? ""),
        });

        console.log("[EditLocation] form.reset com:", {
          clienteId: String(locacaoData.clienteId ?? ""),
          itemId: String(locacaoData.itemId ?? ""),
        });
      } catch (err) {
        console.error("[EditLocation] erro ao carregar dados:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [sheetOpen, rental.id]); // NÃO colocar `form` aqui

  const handleSubmit = async (values: FormData) => {
    try {
      setIsLoading(true);

      const payload = {
        dtLocacao: values.dtLocacao,
        dtDevolucaoPrevista: values.dtDevolucaoPrevista,
        clienteId: parseInt(values.clienteId),
        itemId: parseInt(values.itemId),
      };

      console.log("[EditLocation] Enviando payload:", payload);

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
      setStatus("error");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Força remount do conteúdo do sheet quando abrir / rental mudar,
  // evita problemas onde o componente já está montado e não atualiza a UI.
  const sheetContentKey = `sheet-${rental?.id ?? "no"}-${sheetOpen ? "open" : "closed"}`;

  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>

        {/* key força remount quando rental.id ou sheetOpen muda */}
        <SheetContent key={sheetContentKey} className="overflow-y-auto">
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
                          <Input type="date" {...field} disabled={loading} />
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
                        <FormLabel>Data Prevista</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} disabled={loading} />
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
                        <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
                          <FormControl>
                            <SelectTrigger>
                              {/* Se houver valor, SelectValue mostra ele automaticamente */}
                              <SelectValue placeholder={loading ? "Carregando..." : "Selecione um cliente"} />
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
                        <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={loading ? "Carregando..." : "Selecione um item"} />
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
                    <Button type="button" variant="outline" onClick={() => setSheetOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isLoading || loading}>
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
        onOpenChange={() => setStatus("idle")}
        onClose={() => setStatus("idle")}
        type={status === "success" ? "success" : "error"}
        title={status === "success" ? "Locação atualizada!" : "Erro!"}
        description={
          status === "success"
            ? "As alterações foram salvas."
            : "Verifique os dados e tente novamente."
        }
      />
    </>
  );
}
