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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ConfirmationAlert } from "@/components/ConfirmationAlert";

// Schema sem numInscricao
const formSchema = z
  .object({
    nome: z.string().min(2),
    dtNascimento: z.string().min(1),
    sexo: z.enum(["MASCULINO", "FEMININO"]),
    estahAtivo: z.enum(["true", "false"]),
    tipoCliente: z.enum(["SOCIO", "DEPENDENTE"]),
    cpf: z.string().optional(),
    endereco: z.string().optional(),
    telefone: z.string().optional(),
    socioId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.tipoCliente === "SOCIO") {
        return data.cpf && data.endereco && data.telefone;
      }
      return true;
    },
    { message: "CPF, endereço e telefone são obrigatórios para sócios", path: ["cpf"] }
  )
  .refine(
    (data) => {
      if (data.tipoCliente === "DEPENDENTE") {
        return data.socioId;
      }
      return true;
    },
    { message: "Selecione o sócio responsável", path: ["socioId"] }
  );

type FormValues = z.infer<typeof formSchema>;

interface EditClientsProps {
  client: {
    id: string;
    nome: string;
    dtNascimento: string;
    sexo: "MASCULINO" | "FEMININO";
    estahAtivo: boolean;
    tipoCliente: string;
    cpf?: string;
    endereco?: string;
    telefone?: string;
    socioId?: string;
    numInscricao: string;
  };
  onClientUpdated: () => void;
  children: React.ReactNode;
}

const EditClients = ({ client, onClientUpdated, children }: EditClientsProps) => {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [socios, setSocios] = useState<{ id: number; nome: string }[]>([]);

  useEffect(() => {
    fetch("http://localhost:8081/api/socios")
      .then((res) => res.json())
      .then((data) => setSocios(data))
      .catch((err) => console.error("Erro ao carregar sócios", err));
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: client.nome,
      dtNascimento: client.dtNascimento,
      sexo: client.sexo,
      estahAtivo: client.estahAtivo ? "true" : "false",
      tipoCliente: (client.tipoCliente === "Sócio" ? "SOCIO" : "DEPENDENTE") as "SOCIO" | "DEPENDENTE",
      cpf: client.cpf || "",
      endereco: client.endereco || "",
      telefone: client.telefone || "",
      socioId: client.socioId || "",
    },
  });

  const tipoCliente = form.watch("tipoCliente");

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      const isSocio = values.tipoCliente === "SOCIO";
      
      // Extrair o ID numérico (remover 's-' ou 'd-')
      const clientId = client.id.startsWith('s-') || client.id.startsWith('d-') 
        ? client.id.substring(2) 
        : client.id;

      const endpoint = isSocio
        ? `http://localhost:8081/api/socios/${clientId}`
        : `http://localhost:8081/api/dependentes/${clientId}`;

      if (isSocio) {
        // Formato para Sócio
        const body = {
          id: Number(clientId),
          numInscricao: client.numInscricao,
          nome: values.nome,
          dtNascimento: values.dtNascimento,
          sexo: values.sexo,
          estahAtivo: values.estahAtivo === "true",
          cpf: values.cpf,
          endereco: values.endereco,
          telefone: values.telefone,
        };

        console.log("Enviando dados do sócio:", body);

        const response = await fetch(endpoint, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ao atualizar sócio: ${errorText}`);
        }
      } else {
        // Formato para Dependente
        const body = {
          id: Number(clientId),
          numInscricao: client.numInscricao,
          nome: values.nome,
          dtNascimento: values.dtNascimento,
          sexo: values.sexo,
          estahAtivo: values.estahAtivo === "true",
          socioId: Number(values.socioId),
        };

        console.log("Enviando dados do dependente:", body);

        const response = await fetch(endpoint, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ao atualizar dependente: ${errorText}`);
        }
      }

      setStatus("success");
      onClientUpdated();
      router.refresh();
      setSheetOpen(false);
    } catch (err) {
      console.error("Erro completo:", err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>

        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Editar Cliente</SheetTitle>
            <SheetDescription asChild>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* NOME */}
                  <FormField control={form.control} name="nome" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>

                  {/* DATA */}
                  <FormField control={form.control} name="dtNascimento" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>

                  {/* SEXO */}
                  <FormField control={form.control} name="sexo" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  )}/>

                  {/* STATUS */}
                  <FormField control={form.control} name="estahAtivo" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  )}/>

                  {/* TIPO CLIENTE */}
                  <FormField control={form.control} name="tipoCliente" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Cliente</FormLabel>

                      <Select defaultValue={field.value} disabled>
                        <FormControl>
                          <SelectTrigger disabled>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SOCIO">Sócio</SelectItem>
                          <SelectItem value="DEPENDENTE">Dependente</SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}/>

                  {/* CAMPOS DO SÓCIO */}
                  {tipoCliente === "SOCIO" && (
                    <>
                      <FormField control={form.control} name="cpf" render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF</FormLabel>
                          <FormControl>
                            <Input placeholder="CPF" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>

                      <FormField control={form.control} name="endereco" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endereço</FormLabel>
                          <FormControl>
                            <Input placeholder="Endereço" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>

                      <FormField control={form.control} name="telefone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="Telefone" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                    </>
                  )}

                  {/* CAMPO DO DEPENDENTE */}
                  {tipoCliente === "DEPENDENTE" && (
                    <FormField control={form.control} name="socioId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sócio Responsável</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um sócio" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {socios.map((s) => (
                              <SelectItem key={s.id} value={String(s.id)}>
                                {s.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}/>
                  )}

                  <Button type="submit" disabled={loading}>
                    {loading ? "Atualizando..." : "Salvar"}
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
        title={status === "success" ? "Atualização realizada!" : "Erro"}
        description={
          status === "success"
            ? "O cliente foi atualizado com sucesso."
            : "Verifique os dados e tente novamente."
        }
        onClose={() => setStatus("idle")}
      />
    </>
  );
};

export default EditClients;