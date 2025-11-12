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
import { useState } from "react";
import { ConfirmationAlert } from "@/components/ConfirmationAlert";

const formSchema = z.object({
  nome: z
    .string()
    .min(2, { message: "O nome do ator deve ter pelo menos 2 caracteres!" })
    .max(100, { message: "O nome do ator é muito longo!" }),
});

type FormValues = z.infer<typeof formSchema>;

const AddActor = () => {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [sheetOpen, setSheetOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await fetch("http://localhost:8080/api/atores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: values.nome,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar o ator!");
      }

      await response.json();
      form.reset();
      router.refresh();
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Ator
          </Button>
        </SheetTrigger>

        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="mb-4">Adicionar Novo Ator</SheetTitle>
            <SheetDescription asChild>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
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
                          Insira o nome completo do ator.
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

      {/* ALERTA (fecha sozinho e fecha o Sheet junto) */}
      <ConfirmationAlert
  open={status !== "idle"}
  onOpenChange={(open) => {
    if (!open) setStatus("idle");
  }}
  type={status === "success" ? "success" : "error"}
  title={
    status === "success"
      ? "Ator cadastrado com sucesso!"
      : "Erro ao cadastrar o ator!"
  }
  description={
    status === "success"
      ? "O novo ator foi adicionado ao sistema."
      : "Verifique os dados e tente novamente."
  }
  onClose={() => setStatus("idle")}
  onCloseSheet={() => setSheetOpen(false)}
/>
          </>
        );
      };

export default AddActor;
