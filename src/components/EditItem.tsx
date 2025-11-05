"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- SCHEMA ---
const formSchema = z.object({
  numeroSerie: z.string().min(1, "Número de série obrigatório"),
  dataAquisicao: z.string().min(1, "Data obrigatória"),
  tipo: z.enum(["DVD", "BLURAY"]), // Agora em maiúsculo para match com o backend
  tituloId: z.string().min(1, "Título obrigatório"),
});

type FormData = z.infer<typeof formSchema>;

interface Titulo {
  id: string;
  nome: string;
}

interface EditItemProps {
  children?: React.ReactNode;
  item: any;
  onItemUpdated?: () => void;
}

// URL base do backend
const API_BASE_URL = "http://localhost:8080/api";

export default function EditItem({ children, item, onItemUpdated }: EditItemProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [titulos, setTitulos] = useState<Titulo[]>([]);
  const [loadingTitulos, setLoadingTitulos] = useState(false);
  const [itemCompleto, setItemCompleto] = useState<any>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numeroSerie: "",
      dataAquisicao: "",
      tipo: "DVD", // Valor padrão em maiúsculo
      tituloId: "",
    },
  });

  // Função para testar conexão com o backend
  const testConnection = async (endpoint: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error(`❌ Erro de conexão com ${endpoint}:`, error);
      return false;
    }
  };

  // Buscar dados completos do item quando abrir o modal
  useEffect(() => {
    const fetchItemCompleto = async () => {
      if (!open || !item?.id) return;
      
      setConnectionError(null);

      // Testa conexão antes de fazer a requisição
      const isConnected = await testConnection('/itens/1');
      if (!isConnected) {
        setConnectionError("Backend não está respondendo. Verifique se o servidor está rodando na porta 8080.");
        return;
      }

      try {
        console.log("🔄 Buscando dados completos do item ID:", item.id);
        const response = await fetch(`${API_BASE_URL}/itens/${item.id}`);
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setItemCompleto(data);
        console.log("✅ Item completo recebido do backend:", data);
        
      } catch (error) {
        console.error("❌ Erro ao buscar item completo:", error);
        setConnectionError("Erro ao carregar dados do item: " + (error instanceof Error ? error.message : "Erro desconhecido"));
      }
    };

    fetchItemCompleto();
  }, [open, item?.id]);

  // Carregar títulos do banco de dados
  useEffect(() => {
    const fetchTitulos = async () => {
      if (!open) return;

      setLoadingTitulos(true);
      setConnectionError(null);

      try {
        console.log("🔄 Buscando títulos...");
        const response = await fetch(`${API_BASE_URL}/titulos`);
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setTitulos(data);
        console.log("📚 Títulos carregados:", data);
      } catch (error) {
        console.error("❌ Erro ao carregar títulos:", error);
        setConnectionError("Erro ao carregar lista de títulos: " + (error instanceof Error ? error.message : "Erro desconhecido"));
      } finally {
        setLoadingTitulos(false);
      }
    };

    if (open) {
      fetchTitulos();
    }
  }, [open]);

  // Preencher form quando tivermos os dados completos
  useEffect(() => {
    if (!open || !itemCompleto) return;

    console.log("🎯 Preenchendo form com item completo:", itemCompleto);

    // Usa a data atual como padrão se não tiver data no banco
    const today = new Date().toISOString().split('T')[0];

    // Pega o numeroSerie do item original (que vem da coluna) pois o backend está vazio
    const numeroSerie = item.serialNumber || itemCompleto.numeroSerie || itemCompleto.serialNumber || "";

    // Pega o tituloId do backend e garante que seja string
    const tituloId = String(itemCompleto.tituloId || itemCompleto.titulo?.id || "");

    // Pega o tipo e normaliza para maiúsculo
    const rawTipo = itemCompleto.tipo || itemCompleto.type || "DVD";
    const tipo = String(rawTipo).toUpperCase() as "DVD" | "BLURAY";

    console.log("🔢 Numero serie final:", numeroSerie);
    console.log("🆔 Titulo ID final:", tituloId, "Tipo:", typeof tituloId);
    console.log("🎬 Tipo final:", tipo);

    // Prepara os dados para o reset
    const formData = {
      numeroSerie: numeroSerie,
      dataAquisicao: today,
      tipo: tipo,
      tituloId: tituloId,
    };

    console.log("📤 Dados para form.reset:", formData);
    form.reset(formData);

  }, [open, itemCompleto, item.serialNumber, itemCompleto?.tipo, itemCompleto?.tituloId]);

  const handleSubmit = async (data: FormData) => {
    console.log("📤 Salvando alterações:", data);
    
    setIsLoading(true);
    setConnectionError(null);
    
    try {
      const tituloSelecionado = titulos.find(t => t.id === data.tituloId);
      
      if (!data.tituloId) {
        throw new Error("Selecione um título");
      }

      if (!tituloSelecionado) {
        throw new Error("Título selecionado não encontrado");
      }
      
      // CORREÇÃO: Payload com os nomes em português que o backend espera
      const payload = {
        numeroSerie: data.numeroSerie,
        dataAquisicao: data.dataAquisicao,
        tipo: data.tipo, // Já está em maiúsculo
        tituloId: Number(data.tituloId), // Converte para número pois o backend espera Long
        tituloNome: tituloSelecionado.nome, // Adiciona o nome do título
      };

      console.log("📦 Dados enviados para PUT (em português):", payload);

      const response = await fetch(`${API_BASE_URL}/itens/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = `Erro ${response.status}: ${response.statusText}`;
        
        try {
          const errorText = await response.text();
          if (errorText) {
            try {
              const errorData = JSON.parse(errorText);
              errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
            } catch {
              errorMessage = errorText;
            }
          }
        } catch (textError) {
          console.error("❌ Erro ao ler resposta:", textError);
        }
        
        throw new Error(errorMessage);
      }

      console.log("✅ Item atualizado com sucesso!");
      setOpen(false);
      
      if (onItemUpdated) {
        onItemUpdated();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("❌ Erro completo ao atualizar item:", error);
      setConnectionError("Erro ao atualizar item: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentTituloNome = () => {
    const currentItem = itemCompleto || item;
    if (!currentItem) return "Carregando...";
    
    if (currentItem.titulo?.nome) return currentItem.titulo.nome;
    if (currentItem.tituloNome) return currentItem.tituloNome;
    
    const currentTituloId = currentItem.tituloId || currentItem.titulo?.id;
    if (currentTituloId && titulos.length > 0) {
      const titulo = titulos.find(t => t.id === String(currentTituloId));
      return titulo?.nome || "Selecione um título";
    }
    
    return "Selecione um título";
  };

  return (
    <>
      <div onClick={() => setOpen(true)} className="w-full">
        {children}
      </div>
      
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Editar Item</SheetTitle>
            <SheetDescription>
              {itemCompleto && (!itemCompleto.dataAquisicao && !itemCompleto.acquisitionDate) ? (
                <span className="text-yellow-600">
                  ⚠️ Definindo data de aquisição pela primeira vez
                </span>
              ) : (
                "Atualize as informações do item selecionado."
              )}
            </SheetDescription>
          </SheetHeader>

          {/* MENSAGEM DE ERRO DE CONEXÃO */}
          {connectionError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm mb-4">
              <strong>❌ Erro de Conexão:</strong>
              <div className="mt-1">{connectionError}</div>
            </div>
          )}

          {/* DEBUG VISUAL SIMPLIFICADO */}
          {open && !connectionError && (
            <div className="bg-green-100 border border-green-400 p-3 rounded text-xs mb-4">
              <strong>✅ DADOS CARREGADOS:</strong>
              <div className="mt-1 space-y-1">
                <div>Número Série: <strong>{form.watch("numeroSerie")}</strong></div>
                <div>Data: <strong>{form.watch("dataAquisicao")}</strong></div>
                <div>Tipo: <strong>{form.watch("tipo")}</strong></div>
                <div>Título ID: <strong>{form.watch("tituloId")}</strong></div>
                <div>Título: <strong>{getCurrentTituloNome()}</strong></div>
              </div>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="numeroSerie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Série</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: SN010" 
                        {...field} 
                        disabled={!itemCompleto || !!connectionError}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataAquisicao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Aquisição</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                        value={field.value || ""}
                        disabled={!itemCompleto || !!connectionError}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!itemCompleto || !!connectionError}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DVD">DVD</SelectItem>
                        <SelectItem value="BLURAY">Blu-ray</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tituloId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={loadingTitulos || !itemCompleto || !!connectionError}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue 
                            placeholder={getCurrentTituloNome()}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {titulos.map((titulo) => (
                          <SelectItem key={titulo.id} value={String(titulo.id)}>
                            {titulo.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || loadingTitulos || !itemCompleto || !!connectionError}
                >
                  {isLoading ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
}