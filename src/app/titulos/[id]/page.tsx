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
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import EditTitle from "@/components/EditTitle";
import { Calendar, Film, Star, Videotape  } from "lucide-react";
import ActorList from "@/components/ActorList";
import Link from "next/link";

// Dados mockados completos
const mockTitle = {
  id: "1",
  name: "O Poderoso Chefão",
  director: "Francis Ford Coppola",
  year: 1972,
  category: "Drama",
  className: "Classe A",
  itemCount: 3,
  synopsis: "A saga da família Corleone, uma das mais poderosas famílias da máfia italiana em Nova York. Don Vito Corleone, o chefe da família, decide entregar o império ao seu filho Michael, que inicialmente relutante acaba se envolvendo nos negócios da família.",
  actors: ["Marlon Brando", "Al Pacino", "James Caan", "Robert Duvall", "Diane Keaton", "Talia Shire"],
  createdAt: "2023-01-15",
  updatedAt: "2023-12-01"
};

interface TitlePageProps {
  params: {
    id: string;
  };
}

const TitlePage = async ({ params }: TitlePageProps) => {
  const title = mockTitle;

  return (
    <div className="container mx-auto p-0">
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
            <BreadcrumbPage>{title.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* CONTAINER */}
      <div className="mt-4 flex flex-col xl:flex-row gap-8">
        {/* LEFT - INFORMACOES PRINCIPAIS */}
        <div className="w-full xl:w-2/3 space-y-6">
          {/* TITLE CARD CONTAINER */}
          <div className="bg-primary-foreground p-6 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">{title.name}</h1>
                <p className="text-muted-foreground text-lg">
                  {title.year} • Dirigido por {title.director}
                </p>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button>Editar Título testeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</Button>
                </SheetTrigger>
                <EditTitle />
              </Sheet>
            </div>

            {/* SINOPSE */}
            <div className="bg-muted p-4 rounded-lg">
              <h2 className="font-semibold mb-3 text-lg">Sinopse</h2>
              <p className="text-justify leading-relaxed">{title.synopsis}</p>
            </div>

            {/* INFORMACOES RAPIDAS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted p-4 rounded-lg text-center">
                <Calendar className="mx-auto h-6 w-6 mb-2" />
                <h3 className="font-semibold text-sm">Ano</h3>
                <p className="text-lg font-bold">{title.year}</p>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center">
                <Film className="mx-auto h-6 w-6 mb-2" />
                <h3 className="font-semibold text-sm">Categoria</h3>
                <Badge variant="outline">{title.category}</Badge>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center">
                <Star className="mx-auto h-6 w-6 mb-2" />
                <h3 className="font-semibold text-sm">Classe</h3>
                <Badge variant="secondary">{title.className}</Badge>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center">
                <Videotape className="mx-auto h-6 w-6 mb-2" />
                <h3 className="font-semibold text-sm">Itens</h3>
                <Badge variant={title.itemCount > 0 ? "default" : "destructive"}>
                  {title.itemCount}
                </Badge>
              </div>
            </div>
          </div>

          {/* ELENCO */}
          <div className="bg-primary-foreground p-6 rounded-lg">
            <ActorList title="Elenco" actors={title.actors} />
          </div>
        </div>

        {/* RIGHT - INFORMACOES SECUNDARIAS */}
        <div className="w-full xl:w-1/3 space-y-6">
          {/* STATS CONTAINER */}
          <div className="bg-primary-foreground p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Estatísticas</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total de Locações</span>
                <Badge variant="outline">856</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Reservas Ativas</span>
                <Badge variant="outline">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Avaliação Média</span>
                <Badge variant="default">4.8/5</Badge>
              </div>
            </div>
          </div>

          {/* INFORMACOES DO SISTEMA */}
          <div className="bg-primary-foreground p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Informações do Sistema</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID do Título:</span>
                <span className="font-mono">{title.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cadastrado em:</span>
                <span>{new Date(title.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Última atualização:</span>
                <span>{new Date(title.updatedAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>

          {/* ACÕES */}
          <div className="bg-primary-foreground p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Ações</h2>
            <div className="space-y-3">
              <Button className="w-full" variant="outline">
                Ver Itens Relacionados
              </Button>
              <Button className="w-full" variant="outline">
                Ver Histórico de Locações
              </Button>
              <Button 
                className="w-full" 
                variant="destructive"
                disabled={title.itemCount > 0}
              >
                {title.itemCount > 0 ? "Não pode excluir (possui itens)" : "Excluir Título"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitlePage;