"use client";

import { use, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Calendar, Film, Star, Videotape, Pencil } from "lucide-react";
import EditTitle from "@/components/EditTitle";
import ActorList from "@/components/ActorList";

interface Title {
  id: number;
  nome: string;
  nomeOriginal: string;
  ano: number;
  sinopse: string;
  categoria: string;
  atoresIds: number[];
  diretorId: number;
  classeId: number;
  quantidadeItensDisponiveis: number;
}

export default function TitlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [title, setTitle] = useState<Title | null>(null);
  const [diretorNome, setDiretorNome] = useState<string | null>(null);
  const [classeNome, setClasseNome] = useState<string | null>(null);
  const [atoresNomes, setAtoresNomes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTitle() {
      try {
        const res = await fetch(`http://localhost:8080/api/titulos/${id}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        const data: Title = await res.json();
        setTitle(data);

        // Busca paralela: diretor e classe
        const [diretorRes, classeRes] = await Promise.all([
          fetch(`http://localhost:8080/api/diretores/${data.diretorId}`),
          fetch(`http://localhost:8080/api/classes/${data.classeId}`),
        ]);

        if (diretorRes.ok) {
          const diretor = await diretorRes.json();
          setDiretorNome(diretor.nome || `Diretor #${data.diretorId}`);
        }
        if (classeRes.ok) {
          const classe = await classeRes.json();
          setClasseNome(classe.nome || `Classe #${data.classeId}`);
        }

        // Buscar nomes dos atores
        const nomesAtores: string[] = [];
        for (const atorId of data.atoresIds) {
          const atorRes = await fetch(`http://localhost:8080/api/atores/${atorId}`);
          if (atorRes.ok) {
            const ator = await atorRes.json();
            nomesAtores.push(ator.nome || `Ator #${atorId}`);
          } else {
            nomesAtores.push(`Ator #${atorId}`);
          }
        }
        setAtoresNomes(nomesAtores);
      } catch (err: any) {
        console.error("Erro ao buscar título:", err);
        setError(String(err.message));
      } finally {
        setLoading(false);
      }
    }
    fetchTitle();
  }, [id]);

  if (loading) return <div className="p-6 text-lg">Carregando título...</div>;
  if (error) return <div className="p-6 text-red-600">Erro: {error}</div>;
  if (!title) return <div className="p-6">Título não encontrado.</div>;

  return (
    <div className="container mx-auto p-0">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/titulos">Títulos</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{title.nome}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* CONTEÚDO */}
      <div className="mt-4 flex flex-col xl:flex-row gap-8">
        {/* ESQUERDA */}
        <div className="w-full xl:w-2/3 space-y-6">
          <div className="bg-primary-foreground p-6 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">{title.nome}</h1>
                <p className="text-muted-foreground text-lg">
                  {title.ano} • Diretor: {diretorNome ?? "Carregando..."}
                </p>
              </div>

              {/* ✅ BOTÃO DE EDIÇÃO QUE ABRE O MODAL */}
              <EditTitle
                title={{
                  id: title.id.toString(),
                  nome: title.nome,
                  nomeOriginal: title.nomeOriginal,
                  ano: title.ano,
                  sinopse: title.sinopse,
                  categoria: title.categoria,
                  diretorId: title.diretorId,
                  classeId: title.classeId,
                  atoresIds: title.atoresIds || [],
                }}
                onTitleUpdated={() => window.location.reload()}
              >
                <Button className="flex items-center gap-2">
                  <Pencil className="h-4 w-4" />
                  Editar Título
                </Button>
              </EditTitle>
            </div>

            {/* SINOPSE */}
            <div className="bg-muted p-4 rounded-lg">
              <h2 className="font-semibold mb-3 text-lg">Sinopse</h2>
              <p className="text-justify leading-relaxed">{title.sinopse}</p>
            </div>

            {/* INFO */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted p-4 rounded-lg text-center">
                <Calendar className="mx-auto h-6 w-6 mb-2" />
                <h3 className="font-semibold text-sm">Ano</h3>
                <p className="text-lg font-bold">{title.ano}</p>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center">
                <Film className="mx-auto h-6 w-6 mb-2" />
                <h3 className="font-semibold text-sm">Categoria</h3>
                <Badge variant="outline">{title.categoria}</Badge>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center">
                <Star className="mx-auto h-6 w-6 mb-2" />
                <h3 className="font-semibold text-sm">Classe</h3>
                <Badge variant="secondary">{classeNome ?? "Carregando..."}</Badge>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center">
                <Videotape className="mx-auto h-6 w-6 mb-2" />
                <h3 className="font-semibold text-sm">Itens disponíveis</h3>
                <Badge
                  variant={
                    title.quantidadeItensDisponiveis > 0 ? "default" : "destructive"
                  }
                >
                  {title.quantidadeItensDisponiveis}
                </Badge>
              </div>
            </div>
          </div>

          {/* ELENCO */}
          <div className="bg-primary-foreground p-6 rounded-lg">
            <ActorList title="Elenco" actors={atoresNomes} />
          </div>
        </div>

        {/* DIREITA */}
        <div className="w-full xl:w-1/3 space-y-6">
          <div className="bg-primary-foreground p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Informações do Sistema</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID:</span>
                <span className="font-mono">{title.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Diretor:</span>
                <span>{diretorNome ?? "Carregando..."}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Classe:</span>
                <span>{classeNome ?? "Carregando..."}</span>
              </div>
            </div>
          </div>

          <div className="bg-primary-foreground p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Ações</h2>
            <div className="space-y-3">
              <Button className="w-full" variant="outline">
                Ver Itens Relacionados
              </Button>
              <Button className="w-full" variant="outline">
                Ver Histórico
              </Button>
              <Button
                className="w-full"
                variant="destructive"
                disabled={title.quantidadeItensDisponiveis > 0}
              >
                {title.quantidadeItensDisponiveis > 0
                  ? "Não pode excluir (possui itens)"
                  : "Excluir Título"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
