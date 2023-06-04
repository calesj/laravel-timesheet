import React, {useEffect, useState} from "react";
import {api} from "@/services/api";

interface TableTimescalesProps {
    onEdit: (item: { id: number | string; nome: string; entrada: string; saida: string }) => void
}
export default function TableTimescales({ onEdit }: TableTimescalesProps) {
    const [timescales, setTimescales] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const response = await api.get("timescale");
        setTimescales(response.data);
    };

    const timescaleDelete = async (id: number | string) => {
        const response = await api.delete(`/timescale/${id}`);
        console.log(response)
        fetchData();
    };

    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto">
                <div className="p-1.5 w-full inline-block align-middle">
                    <div className="overflow-hidden border rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    ID
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Nome
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Escala
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                                >
                                    Edit
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                                >
                                    Delete
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {timescales && timescales.length > 0 ? (
                                timescales.map((item:{
                                    id: number | string
                                    nome: string
                                    entrada: string
                                    saida: string
                                }) => (
                                    <tr key={item?.id}>
                                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                            {item?.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                            {item?.nome}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                            {item.entrada ? item.entrada + ' as ' + item.saida : ''}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                            <button
                                                className="text-green-500 hover:text-green-700"
                                                onClick={() => onEdit(item)}
                                            >
                                                Editar
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                            <button
                                                className="text-red-300 hover:text-red-700"
                                                onClick={() => timescaleDelete(item.id)}
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        className="px-6 py-4 text-[50] text-gray-800"
                                        colSpan={5}
                                    >
                                        Não existem Escalas cadastradas!
                                    </td>
                                </tr>
                            )
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}