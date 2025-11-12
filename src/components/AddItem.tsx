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

const itemSchema = z.object({
  numeroSerie: z.string().min(1, "Número de série obrigatório"),
  dataAquisicao: z.string().min(1, "Data obrigatória"),
  tipo: z.enum(["dvd", "bluray", "fita"]),
  tituloId: z.string().min(1, "Selecione um título"),
  tituloNome: z.string().optional(),
});

type ItemForm = z.infer<typeof itemSchema>;

interface Title {
  id: number;
  nome: string;
}

const AddItem = () => {
  const router = useRouter();
  const [titles, setTitles] = useState<Title[]>([]);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTitulo, setSelectedTitulo] = useState<Title | null>(null);

  const form = useForm<ItemForm>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      numeroSerie: "",
      dataAquisicao: "",
      tipo: "dvd",
      tituloId: "",
      tituloNome: "",
    },
  });

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/titulos");
        const data = await res.json();
        setTitles(data);
      } catch (error) {
        console.error("Erro ao buscar títulos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTitles();
  }, []);

  const handleTituloChange = (tituloId: string) => {
    const tituloSelecionado = titles.find(t => String(t.id) === tituloId);

    if (tituloSelecionado) {
      setSelectedTitulo(tituloSelecionado);
      form.setValue("tituloId", tituloId);
      form.setValue("tituloNome", tituloSelecionado.nome);
    }
  };

  const onSubmit = async (values: ItemForm) => {
    try {
      const tipoUpperCase = values.tipo.toUpperCase();

      const payload = {
        numeroSerie: values.numeroSerie,
        dataAquisicao: values.dataAquisicao,
        tipo: tipoUpperCase,
        tituloId: parseInt(values.tituloId),
        tituloNome: values.tituloNome
      };

      console.log("Enviando dados:", payload);

      const res = await fetch("http://localhost:8080/api/itens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao salvar item");

      setStatus("success");
      form.reset({
        numeroSerie: "",
        dataAquisicao: "",
        tipo: "dvd",
        tituloId: "",
        tituloNome: "",
      });
      setSelectedTitulo(null);
      setSheetOpen(false);
      
      // Atualiza a página para mostrar o novo item
      router.refresh();
      
    } catch (error) {
      setStatus("error");
      console.error(error);
    }
  };

  if (loading) return <p>Carregando títulos...</p>;

  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Item
          </Button>
        </SheetTrigger>

        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="mb-4">Adicionar Novo Item</SheetTitle>
            <SheetDescription asChild>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                  <FormField
                    control={form.control}
                    name="numeroSerie"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Série</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o número de série" {...field} />
                        </FormControl>
                        <FormDescription>
                          Código único do item (ex: SN001).
                        </FormDescription>
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
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          Selecione a data em que o item foi adquirido.
                        </FormDescription>
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="dvd">DVD</SelectItem>
                            <SelectItem value="bluray">Blu-ray</SelectItem>
                            <SelectItem value="fita">Fita</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Selecione o tipo de mídia do item.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tituloId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <Select
                          onValueChange={handleTituloChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um título" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {titles.map((t) => (
                              <SelectItem key={t.id} value={String(t.id)}>
                                {t.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {selectedTitulo && (
                            <span className="block mt-1 text-blue-600 font-medium">
                              Título selecionado: {selectedTitulo.nome} (ID: {selectedTitulo.id})
                            </span>
                          )}
                          Selecione o título associado a este item.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tituloNome"
                    render={({ field }) => (
                      <Input type="hidden" {...field} />
                    )}
                  />

                  <Button type="submit">Salvar</Button>
                </form>
              </Form>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      {/* ALERTA - mesmo padrão dos outros componentes */}
      <ConfirmationAlert
        open={status !== "idle"}
        onOpenChange={(open) => {
          if (!open) setStatus("idle");
        }}
        type={status === "success" ? "success" : "error"}
        title={
          status === "success"
            ? "Item cadastrado com sucesso!"
            : "Erro ao cadastrar o item!"
        }
        description={
          status === "success"
            ? "O novo item foi adicionado ao sistema."
            : "Verifique os dados e tente novamente."
        }
        onClose={() => setStatus("idle")}
      />
    </>
  );
};

export default AddItem;