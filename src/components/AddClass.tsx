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

// --- validação com Zod ---
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
    .max(7, { message: "O prazo máximo é 7 dias!" }),
});

type FormValues = z.infer<typeof formSchema>;

const AddClass = () => {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [dataDevolucao, setDataDevolucao] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      valor: 0,
      prazoDevolucao: 7,
    },
  });

  // calcula data de devolução
  const calcularDataDevolucao = (dias: number) => {
    const dataAtual = new Date();
    dataAtual.setDate(dataAtual.getDate() + dias);
    return dataAtual.toLocaleDateString("pt-BR");
  };

  const handlePrazoChange = (dias: number) => {
    if (dias >= 1 && dias <= 7) {
      setDataDevolucao(calcularDataDevolucao(dias));
    } else {
      setDataDevolucao("");
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar a classe!");

      setStatus("success");
      form.reset({ nome: "", valor: 0, prazoDevolucao: 7 });
      setDataDevolucao("");
      router.refresh();
      setSheetOpen(false); // Fecha o sheet diretamente
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
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
                  {/* Nome */}
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

                  {/* Valor */}
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
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Valor cobrado por dia para esta classe.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Prazo */}
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
                            onChange={(e) => {
                              const dias = parseInt(e.target.value);
                              field.onChange(dias);
                              handlePrazoChange(dias);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Prazo máximo para devolução do título (máximo 7 dias).
                          {dataDevolucao && (
                            <span className="block mt-1 text-blue-600 font-medium">
                              Data de devolução: {dataDevolucao}
                            </span>
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar"}
                  </Button>
                </form>
              </Form>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      {/* ALERTA - igual ao primeiro componente */}
      <ConfirmationAlert
        open={status !== "idle"}
        onOpenChange={(open) => {
          if (!open) setStatus("idle");
        }}
        type={status === "success" ? "success" : "error"}
        title={
          status === "success"
            ? "Classe cadastrada com sucesso!"
            : "Erro ao cadastrar a classe!"
        }
        description={
          status === "success"
            ? "A nova classe foi adicionada ao sistema."
            : "Verifique os dados e tente novamente."
        }
        onClose={() => setStatus("idle")}
      />
    </>
  );
};

export default AddClass;