import { Classe, ClasseCreate, ClassesArray, ClasseUpdate } from "@/model/classe";
import api from "@/lib/api";
import { useState } from "react";

export const useClasseHook = () => {
    const [classe, setClasse] = useState<Classe | null>(null);
    const [classes, setClasses] = useState<ClassesArray | null>(null);

    const criarClasse = async (classe: ClasseCreate): Promise<Classe> => {
        const response = await api.post('classe/criar', classe);
        return response.data;
    };

    const editarClasse = async ( classe: ClasseUpdate): Promise<ClasseUpdate> => {
        const response = await api.put(`classe/editar/${classe.id}`, classe);
        return response.data;
    }

    const deletarClasse = async (classeId: string): Promise<void> => {
        const response = await api.delete(`classe/deletar/${classeId}`);
        return response.data;
    }

    const listarClasses = async () => {
        const response = await api.get(`classe/listar`);
        if (response.data) {
            setClasses(response.data);
        }
    }

    const selecionarClasse = async (classeId: string) => {
        const response = await api.get(`classe/listar/${classeId}`);
        if (response.data) {
            setClasse(response.data);
        }
    }

    return {criarClasse, deletarClasse, editarClasse, listarClasses, selecionarClasse, classes, classe}
}