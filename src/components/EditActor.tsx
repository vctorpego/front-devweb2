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
import { Pencil } from "lucide-react"; 
import { useState } from "react";

const formSchema = z.object({
  nome: z
    .string()
    .min(2, { message: "O nome do ator deve ter pelo menos 2 caracteres!" })
    .max(100, { message: "O nome do ator é muito longo!" }),
});

type FormValues = z.infer<typeof formSchema>;

interface EditActorProps {
  actor: {
    id: string;
    name: string;
  };
  onActorUpdated?: () => void;
  onClose?: () => void;
  children?: React.ReactNode;
}

const EditActor = ({ actor, onActorUpdated }: EditActorProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: actor.name,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      
      const response = await fetch(`http://localhost:8080/api/atores/${actor.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: values.nome
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao editar o ator!");
      }

      const data = await response.json();
      console.log("Ator editado:", data);
      alert("Ator editado com sucesso!");
      
      form.reset();
      setOpen(false);
      
      // Chama a função para atualizar a lista
      onActorUpdated?.();
    } catch (error) {
      console.error(error);
      alert("Erro ao editar o ator.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Pencil className="h-4 w-4" />
          Editar Ator
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetDescription asChild>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Ator</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Digite o nome do ator" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Edite o nome completo do ator.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default EditActor;