"use client";

import { useState, useEffect } from "react";
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

interface EditClassProps {
  classe: {
    id: string;
    name: string;
    value: number;
    prazoDevolucao: number;
  };
  onClassUpdated?: () => void;
  children?: React.ReactNode;
}

const EditClass = ({ classe, onClassUpdated, children }: EditClassProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataDevolucao, setDataDevolucao] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: classe.name,
      valor: classe.value,
      prazoDevolucao: classe.prazoDevolucao
    },
  });

  useEffect(() => {
    if (sheetOpen) {
      form.reset({
        nome: classe.name,
        valor: classe.value,
        prazoDevolucao: classe.prazoDevolucao
      });
      handlePrazoChange(classe.prazoDevolucao);
    }
  }, [sheetOpen, classe, form]);

  const calcularDataDevolucao = (dias: number) => {
    const dataAtual = new Date();
    dataAtual.setDate(dataAtual.getDate() + dias);
    return dataAtual.toLocaleDateString('pt-BR');
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

      const response = await fetch(`http://localhost:8080/api/classes/${classe.id}`, {
        method: "PUT",
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
        throw new Error("Erro ao editar a classe!");
      }

      setStatus("success");
      form.reset();
      setSheetOpen(false);
      onClassUpdated?.();
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          {children || (
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Pencil className="h-4 w-4" />
              Editar Classe
            </Button>
          )}
        </SheetTrigger>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="mb-4">Editar Classe</SheetTitle>
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
                          <Input
                            placeholder="Digite o nome da classe"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Edite o nome da classe de título.
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
                            onChange={(e) => {
                              const dias = parseInt(e.target.value) || 0;
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

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSheetOpen(false)}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </div>
                </form>
              </Form>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      {/* ALERTA - mesmo padrão do AddClass */}
      <ConfirmationAlert
        open={status !== "idle"}
        onOpenChange={(open) => {
          if (!open) setStatus("idle");
        }}
        type={status === "success" ? "success" : "error"}
        title={
          status === "success"
            ? "Classe atualizada com sucesso!"
            : "Erro ao atualizar a classe!"
        }
        description={
          status === "success"
            ? "As alterações foram salvas no sistema."
            : "Verifique os dados e tente novamente."
        }
        onClose={() => setStatus("idle")}
      />
    </>
  );
};

export default EditClass;