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
import { ConfirmationAlert } from "@/components/ConfirmationAlert";

const formSchema = z.object({
  nome: z
    .string()
    .min(2, { message: "O nome do diretor deve ter pelo menos 2 caracteres!" })
    .max(100, { message: "O nome do diretor é muito longo!" }),
});

type FormValues = z.infer<typeof formSchema>;

const AddDirector = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/diretores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: values.nome }),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar o diretor!");

      setAlertType("success");
      setAlertOpen(true);
      form.reset();
      router.refresh();

      // fecha o alerta e o sheet após ~1.8s
      setTimeout(() => {
        setAlertOpen(false);
        setOpen(false);
      }, 1800);
    } catch (error) {
      console.error(error);
      setAlertType("error");
      setAlertOpen(true);

      setTimeout(() => {
        setAlertOpen(false);
      }, 1800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ALERT BONITO */}
      <ConfirmationAlert
        open={alertOpen}
        onOpenChange={setAlertOpen}
        type={alertType}
        title={
          alertType === "success"
            ? "Diretor cadastrado com sucesso!"
            : "Erro ao cadastrar diretor!"
        }
        description={
          alertType === "success"
            ? "O novo diretor foi adicionado ao sistema."
            : "Verifique os dados e tente novamente."
        }
        onClose={() => setAlertOpen(false)}
        onCloseSheet={() => setOpen(false)}
      />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Diretor
          </Button>
        </SheetTrigger>

        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="mb-4">Adicionar Novo Diretor</SheetTitle>
            <SheetDescription asChild>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Diretor</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o nome do diretor" {...field} />
                        </FormControl>
                        <FormDescription>
                          Insira o nome completo do diretor.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Salvando..." : "Salvar"}
                    </Button>
                    <Button variant="ghost" onClick={() => setOpen(false)}>
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

export default AddDirector;
