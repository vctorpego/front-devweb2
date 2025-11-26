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
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmationAlert } from "@/components/ConfirmationAlert";

// ----- SCHEMA -----
const locSchema = z.object({
  dtLocacao: z.string().min(1, "Data obrigatória"),
  dtDevolucaoPrevista: z.string().min(1, "Data obrigatória"),
  clienteId: z.string().min(1, "Selecione um cliente"),
  itemId: z.string().min(1, "Selecione um item"),
});

type LocForm = z.infer<typeof locSchema>;

interface Cliente {
  id: number;
  nome: string;
}

interface Item {
  id: number;
  numeroSerie: string;
  titulo: { nome: string };
}

const AddLocation = () => {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [itens, setItens] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<LocForm>({
    resolver: zodResolver(locSchema),
    defaultValues: {
      dtLocacao: "",
      dtDevolucaoPrevista: "",
      clienteId: "",
      itemId: "",
    },
  });

  // ------- BUSCA CLIENTES E ITENS -------
  useEffect(() => {
    const loadData = async () => {
      try {
        const [resClientes, resItens] = await Promise.all([
          fetch("http://localhost:8081/api/clientes"),
          fetch("http://localhost:8081/api/itens"),
        ]);

        setClientes(await resClientes.json());
        setItens(await resItens.json());
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ------- SUBMIT -------
  const onSubmit = async (values: LocForm) => {
    try {
      const payload = {
        dtLocacao: values.dtLocacao,
        dtDevolucaoPrevista: values.dtDevolucaoPrevista,
        clienteId: parseInt(values.clienteId),
        itemId: parseInt(values.itemId),
      };

      console.log("Enviando locação:", payload);

      const res = await fetch("http://localhost:8081/api/locacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao salvar locação");

      setStatus("success");
      form.reset();
      setSheetOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  if (loading) return <p>Carregando dados...</p>;

  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Locação
          </Button>
        </SheetTrigger>

        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="mb-4">Registrar Nova Locação</SheetTitle>
            <SheetDescription asChild>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                  {/* Data Locação */}
                  <FormField
                    control={form.control}
                    name="dtLocacao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data da Locação</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          Data em que o cliente retirou o item.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Data Prevista */}
                  <FormField
                    control={form.control}
                    name="dtDevolucaoPrevista"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data Prevista de Devolução</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          Quando está previsto para devolver.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Cliente */}
                  <FormField
                    control={form.control}
                    name="clienteId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cliente</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um cliente" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clientes.map((c) => (
                              <SelectItem key={c.id} value={String(c.id)}>
                                {c.nome} (ID {c.id})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Item */}
                  <FormField
                    control={form.control}
                    name="itemId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um item" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {itens.map((i) => (
                              <SelectItem key={i.id} value={String(i.id)}>
                                {i.numeroSerie} — {i.titulo?.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit">Salvar Locação</Button>
                </form>
              </Form>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      {/* ALERTA */}
      <ConfirmationAlert
        open={status !== "idle"}
        onOpenChange={(open) => {
          if (!open) setStatus("idle");
        }}
        type={status === "success" ? "success" : "error"}
        title={
          status === "success"
            ? "Locação registrada!"
            : "Erro ao registrar a locação!"
        }
        description={
          status === "success"
            ? "A locação foi inserida no sistema."
            : "Verifique os dados e tente novamente."
        }
        onClose={() => setStatus("idle")}
      />
    </>
  );
};

export default AddLocation;
