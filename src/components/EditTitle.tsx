"use client";

import {
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
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres!" })
    .max(100),
  director: z.string().min(2, { message: "Selecione um diretor!" }),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  category: z.string().min(2, { message: "Selecione uma categoria!" }),
  className: z.string().min(2, { message: "Selecione uma classe!" }),
  synopsis: z.string().min(10, { message: "A sinopse deve ter pelo menos 10 caracteres!" }),
  actors: z.string().min(2, { message: "Selecione pelo menos um ator!" }),
});

const EditTitle = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "O Poderoso Chefão",
      director: "francis-ford-coppola",
      year: 1972,
      category: "drama",
      className: "classe-a",
      synopsis: "A saga da família Corleone, uma das mais poderosas famílias da máfia italiana em Nova York.",
      actors: "marlon-brando",
    },
  });

  // Dados mockados para os selects
  const directors = [
    { id: "francis-ford-coppola", name: "Francis Ford Coppola" },
    { id: "christopher-nolan", name: "Christopher Nolan" },
    { id: "quentin-tarantino", name: "Quentin Tarantino" },
    { id: "martin-scorsese", name: "Martin Scorsese" },
    { id: "steven-spielberg", name: "Steven Spielberg" },
  ];

  const actors = [
    { id: "marlon-brando", name: "Marlon Brando" },
    { id: "al-pacino", name: "Al Pacino" },
    { id: "robert-de-niro", name: "Robert De Niro" },
    { id: "leonardo-dicaprio", name: "Leonardo DiCaprio" },
    { id: "meryl-streep", name: "Meryl Streep" },
  ];

  const categories = [
    { id: "acao", name: "Ação" },
    { id: "drama", name: "Drama" },
    { id: "comedia", name: "Comédia" },
    { id: "ficcao-cientifica", name: "Ficção Científica" },
    { id: "terror", name: "Terror" },
    { id: "romance", name: "Romance" },
    { id: "documentario", name: "Documentário" },
  ];

  const classes = [
    { id: "classe-a", name: "Classe A" },
    { id: "classe-b", name: "Classe B" },
    { id: "classe-c", name: "Classe C" },
    { id: "classe-d", name: "Classe D" },
  ];

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    // Aqui você fará a requisição para atualizar o título
  };

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="mb-4">Editar Título</SheetTitle>
        <SheetDescription asChild>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
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

              <FormField
                control={form.control}
                name="director"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diretor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um diretor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {directors.map((director) => (
                          <SelectItem key={director.id} value={director.id}>
                            {director.name}
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

              <FormField
                control={form.control}
                name="year"
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

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
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

              <FormField
                control={form.control}
                name="className"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classe</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma classe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classes.map((classe) => (
                          <SelectItem key={classe.id} value={classe.id}>
                            {classe.name}
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

              <FormField
                control={form.control}
                name="actors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Atores Principais</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione os atores" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {actors.map((actor) => (
                          <SelectItem key={actor.id} value={actor.id}>
                            {actor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Atores principais do título.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="synopsis"
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

              <Button type="submit">Salvar Alterações</Button>
            </form>
          </Form>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  );
};

export default EditTitle;