import Head from 'next/head'
import {withAuthServerSideProps} from "@/components/getServerSideProps/getServerSideProps";
import {AuthContext} from "@/contexts/AuthContext";
import React, {useContext, useState} from "react";
import Header from "@/components/header";
import {api} from "@/services/api";

export default function Dashboard({id, type}: { id: any; type: any }) {
    const {user, getUser} = useContext(AuthContext)
    const collaborator = user?.collaborator
    const time_records = user?.collaborator?.time_records


    async function timeRecordSubmit(id, type) {
       let response = await api.put(`/time_record/${type}/${id}`).catch(e => {
           alert('desculpe, algo deu errado')
       })
        getUser()
    }

    return (
        <div>
            <Header/>

            <div className="-mt-36 flex flex-col items-center justify-center min-h-screen rounded shadow-xl">
                <h1 className="text-3xl mb-6">Registro de ponto</h1>
                <div className="rounded shadow-xl bg-white p-8 mx-auto">
                <div className="flex flex-wrap justify-center">
                    <button
                        key='entrada'
                        onClick={() => timeRecordSubmit(collaborator?.id, 'entry')}
                        className={(time_records && time_records[0]?.ponto_entrada_registrado) ? "bg-gray-500 text-white font-bold py-6 px-8 rounded-full m-4" : "bg-green-500 hover:bg-green-700 text-white font-bold py-6 px-8 rounded-full m-4"}
                        disabled={(time_records && time_records[0]?.ponto_entrada_registrado)}
                    >
                        Entrada
                    </button>
                    <button
                        key='almoco'
                        onClick={() => timeRecordSubmit(collaborator?.id, 'lunch')}
                        className={(time_records && time_records[0]?.ponto_almoco_registrado) ? "bg-gray-500 text-white font-bold py-6 px-8 rounded-full m-4" : "bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-6 px-8 rounded-full m-4"}
                        disabled={(time_records && time_records[0]?.ponto_almoco_registrado)}
                    >
                        Almoço
                    </button>
                    <button
                        key='retorno_almoco'
                        onClick={() => timeRecordSubmit(collaborator?.id, 'return_lunch')}
                        className={(time_records && time_records[0]?.ponto_retorno_almoco_registrado) ? "bg-gray-500 text-white font-bold py-6 px-8 rounded-full m-4" : "bg-orange-500 hover:bg-orange-700 text-white font-bold py-6 px-8 rounded-full m-4"}
                        disabled={(time_records && time_records[0]?.ponto_retorno_almoco_registrado)}
                    >
                        Volta do Almoço
                    </button>
                    <button
                        key='saida'
                        onClick={() => timeRecordSubmit(collaborator?.id, 'exit')}
                        className={(time_records && time_records[0]?.ponto_saida_registrado)? "bg-gray-500 text-white font-bold py-6 px-8 rounded-full m-4" : "bg-red-400 hover:bg-red-600 text-white font-bold py-6 px-8 rounded-full m-4"}
                        disabled={(time_records && time_records[0]?.ponto_saida_registrado)}
                    >
                        Saída
                    </button>
                </div>
            </div>
            </div>
        </div>
    );
};


export const getServerSideProps = withAuthServerSideProps('/');
