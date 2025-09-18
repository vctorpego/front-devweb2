import {  Ator, AtorCreate, AtoresArray, AtorUpdate } from "@/model/ator";
import api from "@/lib/api";
import { useState } from "react"

export const useAtorHook = () => {
    const [ator, setAtor] = useState<Ator | null>(null);
    const [atores, setAtores] = useState<AtoresArray | null>(null);

    const criarAtor = async (ator: AtorCreate): Promise<Ator> => {
        const response = await api.post('ator/criar', ator);
        return response.data;
    };

    const editarAtor = async ( ator: AtorUpdate): Promise<AtorUpdate> => {
        const response = await api.put(`ator/editar/${ator.id}`, ator);
        return response.data;
    }

    const deletarAtor = async (atorId: string): Promise<void> => {
        const response = await api.delete(`ator/deletar/${atorId}`);
        return response.data;
    }

    const listarAtores = async () => {
        const response = await api.get(`ator/listar`);
        if (response.data) {
            setAtores(response.data);
        }
    }

    const selecionarAtor = async (atorId: string) => {
        const response = await api.get(`ator/listar/${atorId}`);
        if (response.data) {
            setAtor(response.data);
        }
    }

    return {criarAtor, deletarAtor, editarAtor, listarAtores, selecionarAtor, atores, ator}
}