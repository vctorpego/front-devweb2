"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { FeedbackAlert } from "@/components/FeedbackAlert";

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
  children?: React.ReactNode;
}

const EditActor = ({ actor, onActorUpdated, children }: EditActorProps) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | "">("");
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: values.nome }),
      });

      if (!response.ok) throw new Error("Erro ao editar o ator!");

      setStatus("success");
      form.reset();

      setTimeout(() => {
        setStatus("");
        setOpen(false);
        onActorUpdated?.();
      }, 2000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setTimeout(() => setStatus(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
                    ? "O ator foi atualizado no sistema."
                    : "Verifique os dados e tente novamente."
                }
              />
            </div>
          </div>,
          document.body
        )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          {children || (
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Pencil className="h-4 w-4" /> Editar Ator
            </Button>
          )}
        </SheetTrigger>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="mb-4">Editar Ator</SheetTitle>
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
                          <Input placeholder="Digite o nome do ator" {...field} />
                        </FormControl>
                        <FormDescription>Edite o nome completo do ator.</FormDescription>
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
    </>
  );
};

export default EditActor;
