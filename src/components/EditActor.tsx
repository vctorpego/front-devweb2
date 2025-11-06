"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { FeedbackAlert } from "@/components/FeedbackAlert";

const formSchema = z.object({
  nome: z.string().min(2).max(100),
});

type FormValues = z.infer<typeof formSchema>;

interface EditActorProps {
  actor: { id: string; name: string };
  onActorUpdated?: () => void;
}

const EditActor = ({ actor, onActorUpdated }: EditActorProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | "">("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: actor.name },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/api/atores/${actor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: values.nome }),
      });
      if (!res.ok) throw new Error("Erro!");
      await res.json();

      // Mostra alerta de sucesso
      setStatus("success");
      form.reset();

      setTimeout(() => {
        setStatus("");
        setOpen(false);
        onActorUpdated?.();
      }, 2000);
    } catch {
      setStatus("error");

      setTimeout(() => setStatus(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ALERTA CENTRALIZADO */}
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

      {/* SHEET */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Pencil className="h-4 w-4" /> Editar Ator
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
                          <Input placeholder="Digite o nome do ator" {...field} />
                        </FormControl>
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
