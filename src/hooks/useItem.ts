import { Item, ItemCreate, ItemUpdate, ItensArray } from "@/model/item";
import { TitulosArray } from "@/model/titulo";
import api from "@/lib/api";
import { useState } from "react";

export const useItemHook = () => {
    const [item, setItem] = useState<Item | null>(null);
    const [itens, setItens] = useState<ItensArray | null>(null);
    const [titulos, setTitulos] = useState<TitulosArray | null>(null);

    const criarItem = async (itemData: ItemCreate): Promise<Item> => {
        const response = await api.post('item/criar', itemData);
        return response.data;
    };

    const editarItem = async (itemData: ItemUpdate): Promise<Item> => {
        const response = await api.put(`item/editar/${itemData.id}`, itemData);
        return response.data;
    };

    const deletarItem = async (itemId: string): Promise<void> => {
        await api.delete(`item/deletar/${itemId}`);
    };

    const listarItens = async (): Promise<void> => {
        const response = await api.get('item/listar');
        if (response.data) {
            setItens(response.data);
        }
    };

    const selecionarItem = async (itemId: string) => {
        const response = await api.get(`item/listar/${itemId}`);
        if (response.data) {
            setItem(response.data);
        }
    };

    const listarTitulos = async (): Promise<void> => {
        const response = await api.get('titulo/listar');
        if (response.data) {
            setTitulos(response.data);
        }
    };

    return {
        criarItem,
        editarItem,
        deletarItem,
        listarItens,
        selecionarItem,
        itens,
        item,
        listarTitulos,
        titulos,
    };
};
