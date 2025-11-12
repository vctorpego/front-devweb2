"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmationAlert } from "@/components/ConfirmationAlert";

const formSchema = z.object({
  nome: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres!" }),
  nomeOriginal: z.string().min(2, { message: "O nome original deve ter pelo menos 2 caracteres!" }),
  ano: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  sinopse: z.string().min(10, { message: "A sinopse deve ter pelo menos 10 caracteres!" }),
  categoria: z.string().min(1, { message: "Selecione uma categoria!" }),
  diretorId: z.string().min(1, { message: "Selecione um diretor!" }),
  classeId: z.string().min(1, { message: "Selecione uma classe!" }),
  atoresIds: z.array(z.string()).min(1, { message: "Selecione pelo menos um ator!" }),
});

type FormValues = z.infer<typeof formSchema>;

interface Diretor {
  id: number;
  nome: string;
}

interface Ator {
  id: number;
  nome: string;
}

interface Classe {
  id: number;
  nome: string;
}

interface EditTitleProps {
  title: {
    id: string;
    nome: string;
    nomeOriginal: string;
    ano: number;
    sinopse: string;
    categoria: string;
    diretorId: number;
    classeId: number;
    atoresIds?: number[];
  };
  onTitleUpdated?: () => void;
  children?: React.ReactNode;
}

const CATEGORIAS_FIXAS = [
  "Ação", "Aventura", "Comédia", "Drama", "Ficção Científica",
  "Terror", "Romance", "Fantasia", "Musical", "Suspense"
];

const EditTitle = ({ title, onTitleUpdated, children }: EditTitleProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [diretores, setDiretores] = useState<Diretor[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [atores, setAtores] = useState<Ator[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: title.nome,
      nomeOriginal: title.nomeOriginal,
      ano: title.ano,
      sinopse: title.sinopse,
      categoria: title.categoria,
      diretorId: String(title.diretorId),
      classeId: String(title.classeId),
      atoresIds: title.atoresIds ? title.atoresIds.map(id => String(id)) : [],
    },
  });

  useEffect(() => {
    if (!sheetOpen) return;

    const fetchData = async () => {
      try {
        setDataLoaded(false);
        const [diretoresRes, classesRes, atoresRes] = await Promise.all([
          fetch("http://localhost:8080/api/diretores"),
          fetch("http://localhost:8080/api/classes"),
          fetch("http://localhost:8080/api/atores"),
        ]);

        const [diretoresData, classesData, atoresData] = await Promise.all([
          diretoresRes.json(),
          classesRes.json(),
          atoresRes.json(),
        ]);

        setDiretores(diretoresData);
        setClasses(classesData);
        setAtores(atoresData);
        setDataLoaded(true);

      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setDataLoaded(true);
      }
    };

    fetchData();
  }, [sheetOpen]);

  useEffect(() => {
    if (dataLoaded && sheetOpen) {
      form.reset({
        nome: title.nome,
        nomeOriginal: title.nomeOriginal,
        ano: title.ano,
        sinopse: title.sinopse,
        categoria: title.categoria,
        diretorId: String(title.diretorId),
        classeId: String(title.classeId),
        atoresIds: title.atoresIds ? title.atoresIds.map(id => String(id)) : [],
      });
    }
  }, [dataLoaded, sheetOpen, title, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      const payload = {
        nome: values.nome,
        nomeOriginal: values.nomeOriginal,
        ano: values.ano,
        sinopse: values.sinopse,
        categoria: values.categoria,
        diretorId: Number(values.diretorId),
        classeId: Number(values.classeId),
        atoresIds: values.atoresIds.map(id => Number(id)),
      };

      const response = await fetch(`http://localhost:8080/api/titulos/${title.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      setStatus("success");
      form.reset();
      setSheetOpen(false);
      onTitleUpdated?.();

    } catch (error) {
      console.error("Erro ao editar título:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>

        <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="mb-4">Editar Título</SheetTitle>
            <SheetDescription asChild>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Título</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>Este é o nome público do título.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nomeOriginal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Original</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>Nome original do título.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ano"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ano de Lançamento</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>Ano em que o título foi lançado.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sinopse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sinopse</FormLabel>
                        <FormControl>
                          <Textarea rows={4} placeholder="Digite a sinopse..." {...field} />
                        </FormControl>
                        <FormDescription>Descrição completa do enredo do título.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="categoria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORIAS_FIXAS.map((categoria) => (
                              <SelectItem key={categoria} value={categoria}>
                                {categoria}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Categoria principal do título.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="diretorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Diretor</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um diretor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {diretores.map(d => (
                              <SelectItem key={d.id} value={String(d.id)}>
                                {d.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Diretor responsável pelo título.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="classeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Classe</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma classe" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {classes.map(c => (
                              <SelectItem key={c.id} value={String(c.id)}>
                                {c.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Classe de preço e prazo do título.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="atoresIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Atores Principais</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            const currentValues = field.value || [];
                            if (!currentValues.includes(value)) {
                              field.onChange([...currentValues, value]);
                            }
                          }}
                          value=""
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione os atores" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {atores.map(a => (
                              <SelectItem key={a.id} value={String(a.id)}>
                                {a.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {field.value && field.value.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-muted-foreground font-medium mb-2">Atores selecionados:</p>
                            <div className="space-y-2">
                              {field.value.map(actorId => {
                                const actor = atores.find(a => String(a.id) === actorId);
                                return (
                                  <div key={actorId} className="bg-secondary text-secondary-foreground px-3 py-2 rounded-md text-sm flex items-center justify-between">
                                    <span>{actor?.nome}</span>
                                    <button
                                      type="button"
                                      onClick={() => field.onChange(field.value.filter(id => id !== actorId))}
                                      className="text-muted-foreground hover:text-foreground text-sm"
                                    >
                                      Remover
                                    </button>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loading || !dataLoaded}>
                    {loading ? "Salvando..." : "Salvar Alterações"}
                  </Button>
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
            ? "Título atualizado com sucesso!"
            : "Erro ao atualizar o título!"
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
};

export default EditTitle;