"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Rental {
  id: number;
  dtLocacao: string;
  clienteNome: string;
  itemNumeroSerie: string;
  estaVigente: boolean;
}

export function AddDevolution() {
  const [open, setOpen] = useState(false);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function formatISODate(dateString: string | null) {
    if (!dateString) return "—";
    const [y, m, d] = dateString.split("-");
    return `${d}/${m}/${y}`;
  }

  // =============================
  // BUSCAR LOCAÇÕES VIGENTES
  // =============================
  useEffect(() => {
    if (!open) return;

    fetch("http://localhost:8081/api/locacoes")
      .then((res) => res.json())
      .then((data) => {
        const vigentes = data.filter((d: any) => d.estaVigente === true);
        setRentals(vigentes);
      })
      .catch((err) => console.error("Erro ao carregar locações:", err));
  }, [open]);

  // =============================
  // REALIZAR DEVOLUÇÃO
  // =============================
  async function handleSubmit() {
    if (!selectedId) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `http://localhost:8081/api/locacoes/${selectedId}/devolucao`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao registrar devolução.");
      }

      setIsSubmitting(false);
      setOpen(false);
      setSelectedId(null);

      alert("Devolução registrada com sucesso!");
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      alert("Erro ao tentar registrar devolução.");
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="bg-primary text-white px-4 py-2 rounded-md">
          Registrar Devolução
        </Button>
      </SheetTrigger>

      <SheetContent className="w-[450px] p-6 space-y-4">
        <SheetHeader>
          <SheetTitle>Registrar Devolução</SheetTitle>
        </SheetHeader>

        {/* SELECT DE LOCAÇÃO */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium">Selecione a Locação</label>
          <select
            className="border rounded-md p-2"
            value={selectedId ?? ""}
            onChange={(e) => setSelectedId(Number(e.target.value))}
          >
            <option value="">Selecione...</option>

            {rentals.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id} — {r.clienteNome} — {formatISODate(r.dtLocacao)}
              </option>
            ))}
          </select>
        </div>

        {/* BOTÃO DE CONFIRMAR */}
        <Button
          disabled={isSubmitting || !selectedId}
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Confirmar Devolução"
          )}
        </Button>
      </SheetContent>
    </Sheet>
  );
}
