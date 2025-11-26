"use client";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// --- Zod validation ---
const formSchema = z
  .object({
    nome: z.string().min(2),
    dtNascimento: z.string().min(1),
    sexo: z.enum(["MASCULINO", "FEMININO"]),
    estahAtivo: z.enum(["true", "false"]),
    tipoCliente: z.enum(["SOCIO", "DEPENDENTE"]),

    // Sócio
    cpf: z.string().optional(),
    endereco: z.string().optional(),
    telefone: z.string().optional(),

    // Dependente
    socioId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.tipoCliente === "SOCIO") {
        return data.cpf && data.endereco && data.telefone;
      }
      return true;
    },
    {
      message: "CPF, endereço e telefone são obrigatórios para sócios",
      path: ["cpf"],
    }
  )
  .refine(
    (data) => {
      if (data.tipoCliente === "DEPENDENTE") {
        return data.socioId;
      }
      return true;
    },
    {
      message: "Selecione o sócio responsável",
      path: ["socioId"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

const AddClients = () => {
  const router = useRouter();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const [socios, setSocios] = useState<{ id: number; nome: string }[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/socios")
      .then((res) => res.json())
      .then((data) => setSocios(data))
      .catch((err) => console.error("Erro ao carregar sócios", err));
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      dtNascimento: "",
      sexo: undefined,
      estahAtivo: "true",
      tipoCliente: "SOCIO",
      cpf: "",
      endereco: "",
      telefone: "",
      socioId: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      const isSocio = values.tipoCliente === "SOCIO";
      const endpoint = isSocio
        ? "http://localhost:8080/api/socios"
        : "http://localhost:8080/api/dependentes";

      const body = isSocio
        ? {
            nome: values.nome,
            dtNascimento: values.dtNascimento,
            sexo: values.sexo,
            estahAtivo: values.estahAtivo === "true",
            cpf: values.cpf,
            endereco: values.endereco,
            telefone: values.telefone,
          }
        : {
            nome: values.nome,
            dtNascimento: values.dtNascimento,
            sexo: values.sexo,
            estahAtivo: values.estahAtivo === "true",
            socioId: Number(values.socioId),
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar!");

      setStatus("success");
      form.reset();
      router.refresh();
      setSheetOpen(false);
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const tipoCliente = form.watch("tipoCliente");

  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo Cliente
          </Button>
        </SheetTrigger>

        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Adicionar Novo Cliente</SheetTitle>
            <SheetDescription asChild>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* NOME */}
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* DATA */}
                  <FormField
                    control={form.control}
                    name="dtNascimento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Nascimento</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* SEXO */}
                  <FormField
                    control={form.control}
                    name="sexo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sexo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MASCULINO">Masculino</SelectItem>
                            <SelectItem value="FEMININO">Feminino</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* STATUS */}
                  <FormField
                    control={form.control}
                    name="estahAtivo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="true">Ativo</SelectItem>
                            <SelectItem value="false">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* TIPO */}
                  <FormField
                    control={form.control}
                    name="tipoCliente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Cliente</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="SOCIO">Sócio</SelectItem>
                            <SelectItem value="DEPENDENTE">
                              Dependente
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  {/* CAMPOS EXTRAS DO SÓCIO */}
                  {tipoCliente === "SOCIO" && (
                    <>
                      <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CPF</FormLabel>
                            <FormControl>
                              <Input placeholder="CPF" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endereco"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Endereço</FormLabel>
                            <FormControl>
                              <Input placeholder="Endereço" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="telefone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input placeholder="Telefone" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* CAMPO EXCLUSIVO DO DEPENDENTE */}
                  {tipoCliente === "DEPENDENTE" && (
                    <FormField
                      control={form.control}
                      name="socioId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sócio Responsável</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um sócio" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              {socios.map((socio) => (
                                <SelectItem
                                  key={socio.id}
                                  value={String(socio.id)}
                                >
                                  {socio.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <Button type="submit" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar"}
                  </Button>
                </form>
              </Form>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <ConfirmationAlert
        open={status !== "idle"}
        onOpenChange={(open) => !open && setStatus("idle")}
        type={status === "success" ? "success" : "error"}
        title={status === "success" ? "Cadastro realizado!" : "Erro"}
        description={
          status === "success"
            ? "O cliente foi adicionado com sucesso."
            : "Verifique os dados e tente novamente."
        }
        onClose={() => setStatus("idle")}
      />
    </>
  );
};

export default AddClients;
