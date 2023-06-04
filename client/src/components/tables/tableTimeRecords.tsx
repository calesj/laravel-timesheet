import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "@/contexts/AuthContext";
import {api} from "@/services/api";

interface TableTimeRecordsProps {
    onEdit: (item: {
        almoco_retorno: string
        almoco_saida: string
        collaborator_id: string
        created_at: string
        data: string
        entrada: string
        id: string | number
        ponto_almoco_registrado : boolean
        ponto_entrada_registrado: boolean
        ponto_retorno_almoco_registrado: boolean
        ponto_saida_registrado: boolean
        saida: string
        saldo_final: string
    }) => void;
}

export default function TableTimeRecords({onEdit}: TableTimeRecordsProps) {
    const [timeRecords, setTimeRecords] = useState([]);
    const {user, getUser} = useContext(AuthContext)

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        if (user && user.collaborator && user.collaborator.id != null) {
            const response = await api.get(`time_record/${user.collaborator.id}`);
            setTimeRecords(response.data);
        }
    }
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
                                    Data de Registro
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Entrada
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Almoco
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Retorno do Almoco
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Saida
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Saldo Final do dia
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                                >
                                    Edit
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {timeRecords && timeRecords.length > 0 ? (
                                timeRecords.map((item: {
                                    almoco_retorno: string
                                    almoco_saida: string
                                    collaborator_id: string
                                    created_at: string
                                    data: string
                                    entrada: string
                                    id: string | number
                                    ponto_almoco_registrado : boolean
                                    ponto_entrada_registrado: boolean
                                    ponto_retorno_almoco_registrado: boolean
                                    ponto_saida_registrado: boolean
                                    saida: string
                                    saldo_final: string
                                }) => (
                                    <tr key= {item?.data ?? ''}>
                                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                            {item?.data}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                            {item?.entrada}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                            {item?.almoco_saida}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                            {item?.almoco_retorno}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                            {item?.saida}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                            {item?.saldo_final}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                            <button
                                                className="text-green-500 hover:text-green-700"
                                                onClick={() => onEdit(item)}
                                            >
                                                Editar
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
                                        Não existem Colaboradores cadastrados!
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