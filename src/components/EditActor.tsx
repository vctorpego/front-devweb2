"use client";

import { useState } from "react";
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
import { ConfirmationAlert } from "@/components/ConfirmationAlert";

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
  const [open, setOpen] = useState(false); // sheet open
  const [alertOpen, setAlertOpen] = useState(false); // confirmation alert open
  const [alertType, setAlertType] = useState<"success" | "error">("success");
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

      const response = await fetch(
        `http://localhost:8081/api/atores/${actor.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome: values.nome }),
        }
      );

      if (!response.ok) throw new Error("Erro ao editar o ator!");

      // success
      setAlertType("success");
      setAlertOpen(true);
      form.reset();

      // fecha sheet e notifica lista depois de 1.8s (alert some antes de fechar totalmente)
      setTimeout(() => {
        setAlertOpen(false);
        setOpen(false);
        onActorUpdated?.();
      }, 1800);
    } catch (error) {
      console.error(error);
      setAlertType("error");
      setAlertOpen(true);

      // só fechar o alerta de erro depois de 1.8s
      setTimeout(() => {
        setAlertOpen(false);
      }, 1800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Confirmation alert (shared success/error) */}
      <ConfirmationAlert
        open={alertOpen}
        onOpenChange={setAlertOpen}
        type={alertType}
        title={
          alertType === "success"
            ? "Alterações salvas com sucesso!"
            : "Erro ao salvar alterações!"
        }
        description={
          alertType === "success"
            ? "O ator foi atualizado no sistema."
            : "Verifique os dados e tente novamente."
        }
        onClose={() => setAlertOpen(false)}
        onCloseSheet={() => setOpen(false)}
      />

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

                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
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
