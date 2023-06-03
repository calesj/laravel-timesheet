import React, {useEffect, useState} from "react";
import {api} from "@/services/api";
import { FaSearch } from 'react-icons/fa';
import {useForm} from "react-hook-form";
import {IoMdRefresh} from "react-icons/io";

export default function TableCollaborators({ onEdit }) {
    const [collaborators, setCollaborators] = useState([]);
    const {register, handleSubmit, reset } = useForm();

    useEffect(() => {
        fetchData();
    }, []);

    // METODO RESPONSAVEL, POR CARREGAR OS DADOS DE TODOS OS USUARIOS
    const fetchData = async () => {
        reset()
        const response = await api.get("collaborator");
        setCollaborators(response.data);
    }

    // METODO RESPONSAVEL POR FAZER BUSCA NA API
    const search = async (busca = null) => {
        if(busca?.busca != '') {
            const response = await api.get(`collaborator/search/${busca?.busca}`);
            console.log(response)
            setCollaborators(response.data);
        } else {
            fetchData()
        }

    }

    // METODO RESPONSAVEL POR DELETAR UM USUARIO
    const collaboratorDelete = async (id) => {
        const response = await api.delete(`/delete/${id}`);
        fetchData();
    };

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-center mb-4 sm:w-full md:w-2/3 lg:w-1/2">
                <form className="flex space-x-2" onSubmit={handleSubmit(search)}>
                    <input
                        {...register('busca')}
                        type="text"
                        className="w-full sm:w-auto px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
                        placeholder="Buscar por nome..."
                    />
                    <button type="submit" className="text-gray-500">
                        <FaSearch />
                    </button>
                    <button
                        className="px-1 text-gray-500"
                        onClick={() => fetchData()}
                    >
                        <IoMdRefresh />
                    </button>
                </form>
            </div>
            <div className="overflow-x-auto">
                <div className="p-1.5 w-full inline-block align-middle">
                    <div className="overflow-hidden border rounded-lg">
                        <table className="min-w-full table-auto divide-y divide-gray-200">
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
                                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Matricula
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
                            {collaborators && collaborators.length > 0 ? (
                                collaborators.map((item) => (
                                    <tr key={item?.id}>
                                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                            {item?.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                            {item?.user?.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                            {item?.timescale?.id ? item.timescale.entrada + ' as ' + item.timescale.saida : ''}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                            {item?.matricula}
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
                                                onClick={() => collaboratorDelete(item?.user_id)}
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