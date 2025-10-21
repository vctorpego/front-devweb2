"use client";

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
import { useRouter } from "next/navigation";
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

const formSchema = z.object({
  nome: z
    .string()
    .min(2, { message: "O nome da classe deve ter pelo menos 2 caracteres!" })
    .max(100, { message: "O nome da classe é muito longo!" }),
  valor: z
    .number({ message: "O valor é obrigatório!" })
    .min(0.01, { message: "O valor deve ser maior que zero!" }),
  prazoDevolucao: z
    .number({ message: "O prazo de devolução é obrigatório!" })
    .int({ message: "O prazo deve ser um número inteiro!" })
    .min(1, { message: "O prazo deve ser pelo menos 1 dia!" })
    .max(7, { message: "O prazo máximo é 7 dias!" })
});

type FormValues = z.infer<typeof formSchema>;

const AddClass = () => {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      valor: 0,
      prazoDevolucao: 7
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await fetch("http://localhost:8080/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: values.nome,
          valor: values.valor,
          prazoDevolucao: values.prazoDevolucao
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar a classe!");
      }

      const data = await response.json();
      console.log("Classe cadastrada:", data);
      form.reset({
        nome: "",
        valor: 0,
        prazoDevolucao: 7
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar a classe.");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Classe
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="mb-4">Adicionar Nova Classe</SheetTitle>
          <SheetDescription asChild>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Classe</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome da classe" {...field} />
                      </FormControl>
                      <FormDescription>
                        Insira o nome da classe de título.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.01"
                          placeholder="Digite o valor"
                          value={field.value || ""}
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Valor cobrado por dia para esta classe.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="prazoDevolucao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prazo de Devolução (dias)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="Digite o prazo em dias"
                          min="1"
                          max="7"
                          value={field.value}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Prazo máximo para devolução do título (máximo 7 dias).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit">Salvar</Button>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default AddClass;