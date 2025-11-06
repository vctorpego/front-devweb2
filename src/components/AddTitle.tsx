"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { FeedbackAlert } from "@/components/FeedbackAlert";

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

interface Director {
  id: number;
  nome: string;
}

interface Actor {
  id: number;
  nome: string;
}

interface Classe {
  id: number;
  nome: string;
}

const CATEGORIAS_FIXAS = [
  "Ação", "Aventura", "Comédia", "Drama", "Ficção Científica", 
  "Terror", "Romance", "Fantasia", "Musical", "Suspense"
];

const AddTitle = () => {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [actors, setActors] = useState<Actor[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      nomeOriginal: "",
      ano: new Date().getFullYear(),
      sinopse: "",
      categoria: "",
      diretorId: "",
      classeId: "",
      atoresIds: [],
    },
  });

  // Buscar dados do backend quando o modal abrir
  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      try {
        const [directorsRes, actorsRes, classesRes] = await Promise.all([
          fetch("http://localhost:8080/api/diretores"),
          fetch("http://localhost:8080/api/atores"),
          fetch("http://localhost:8080/api/classes")
        ]);

        const directorsData = await directorsRes.json();
        const actorsData = await actorsRes.json();
        const classesData = await classesRes.json();

        setDirectors(Array.isArray(directorsData) ? directorsData : []);
        setActors(Array.isArray(actorsData) ? actorsData : []);
        setClasses(Array.isArray(classesData) ? classesData : []);

      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [open]);

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      const payload = {
        nome: values.nome,
        nomeOriginal: values.nomeOriginal,
        ano: values.ano,
        sinopse: values.sinopse,
        categoria: values.categoria,
        diretorId: parseInt(values.diretorId),
        classeId: parseInt(values.classeId),
        atoresIds: values.atoresIds.map(id => parseInt(id)),
        quantidadeItensDisponiveis: 1
      };

      const response = await fetch("http://localhost:8080/api/titulos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erro ao criar título");

      // Mostra alerta de sucesso
      setStatus("success");
      form.reset();

      setTimeout(() => {
        setStatus("idle");
        setOpen(false);
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error("Erro:", error);
      setStatus("error");
      
      setTimeout(() => setStatus("idle"), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ALERTA CENTRALIZADO - IGUAL AO ADDACTOR */}
      {status !== "idle" &&
        createPortal(
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg shadow-lg w-[380px] flex flex-col items-center text-center">
              <FeedbackAlert
                type={status === "success" ? "success" : "error"}
                title={
                  status === "success" 
                    ? "Título cadastrado com sucesso!" 
                    : "Erro ao cadastrar o título!"
                }
                description={
                  status === "success"
                    ? "O novo título foi adicionado ao sistema."
                    : "Verifique os dados e tente novamente."
                }
              />
            </div>
          </div>,
          document.body
        )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Título
          </Button>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="mb-4">Adicionar Novo Título</SheetTitle>
            <SheetDescription asChild>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Nome do Título */}
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Título</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Este é o nome público do título.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Nome Original */}
                  <FormField
                    control={form.control}
                    name="nomeOriginal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Original</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Nome original do título.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Ano de Lançamento */}
                  <FormField
                    control={form.control}
                    name="ano"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ano de Lançamento</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Ano em que o título foi lançado.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Sinopse */}
                  <FormField
                    control={form.control}
                    name="sinopse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sinopse</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={4}
                            placeholder="Digite a sinopse do título..."
                          />
                        </FormControl>
                        <FormDescription>
                          Descrição completa do enredo do título.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Categoria */}
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
                        <FormDescription>
                          Categoria principal do título.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Diretor */}
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
                            {directors.map((director) => (
                              <SelectItem key={director.id} value={String(director.id)}>
                                {director.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Diretor responsável pelo título.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Classe */}
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
                            {classes.map((classe) => (
                              <SelectItem key={classe.id} value={String(classe.id)}>
                                {classe.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Classe de preço e prazo do título.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Atores */}
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
                            {actors.map((actor) => (
                              <SelectItem key={actor.id} value={String(actor.id)}>
                                {actor.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        {/* Atores selecionados */}
                        {field.value && field.value.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-muted-foreground font-medium mb-2">
                              Atores selecionados:
                            </p>
                            <div className="space-y-2">
                              {field.value.map((actorId) => {
                                const actor = actors.find(a => String(a.id) === actorId);
                                return (
                                  <div
                                    key={actorId}
                                    className="bg-secondary text-secondary-foreground px-3 py-2 rounded-md text-sm flex items-center justify-between"
                                  >
                                    <span>{actor?.nome}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newValues = field.value.filter(id => id !== actorId);
                                        field.onChange(newValues);
                                      }}
                                      className="text-muted-foreground hover:text-foreground text-sm"
                                    >
                                      Remover
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loading}>
                    {loading ? "Criando..." : "Criar Título"}
                  </Button>
                </form>
              </Form>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AddTitle;