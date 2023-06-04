import Head from 'next/head'
import Header from "@/components/header";
import {withAuthServerSideProps} from "@/components/getServerSideProps/getServerSideProps";
import {FieldValues, SubmitHandler, useForm} from 'react-hook-form';
import React, {useState} from "react";
import InputMask from 'react-input-mask';
import {api} from "@/services/api";
import TableTimeRecords from "@/components/tables/tableTimeRecords";

export default function Timerecords() {
    const { register, handleSubmit, reset } = useForm();
    const [card, setCard] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})
    const [success, setSuccess] = useState(false)
    const [timerecords, setTimerecords] = useState<{
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
    } | null>(null);

    // INTERFACE DOS POSSIVEIS ERROS
    interface FormErrors {
        entrada?: string
        almoco_saida?: string
        almoco_retorno?: string
        saida?: string
    }

    // METODO RESPONSAVEL POR ABRIR O CARD DE EDICAO
    async function openCard() {
        setSuccess(false)
        setErrors({})
        setCard(true)
        reset()
    }

    // METODO RESPONSAVEL POR FECHAR O CARD DE EDICAO
    async function closeCard() {
        setTimerecords(null)
        setSuccess(false)
        setErrors({})
        setCard(false)
        reset()
    }

    // METODO RESPONSAVEL POR ATUALIZAR UM REGISTRO DE PONTO NO BANCO
    const handleSaveTimerecords: SubmitHandler<FieldValues> = async (data) => {
        // ADICIONANDO A PROPRIEDADE DATA, COM O VALOR DA DATA DO REGISTRO QUE O USUARIO ESCOLHEU PRA EDITAR
        data.data = timerecords?.data
        const response = await api.put(`time_record/update/${timerecords?.collaborator_id}`, data)
                .then(response => {
                    if (response.data.id) {
                        setErrors({})
                        setSuccess(true)
                        setTimerecords(response.data)
                    }
                }).catch(e => {
                    setErrors(e.response.data.errors)
                })
        console.log(response)
        reset()
    }

    const timeRecordEdit = (item: {
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
    }) => {
        setTimerecords(item)
        openCard()
    }
    return (
        <div>
            <Head>
                <title>Registros de ponto</title>
            </Head>

            {
                // COMPONENTE HEADER DA PAGINA
            }
            <Header/>

            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Meus registros de ponto</h1>
                </div>
            </header>
            <main>
                {card ? (

                    <div>

                        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                            <div className="bg-white shadow-xl p-4 rounded-lg">
                                <div className="px-4 sm:px-0 flex justify-end">
                                    <h1 className="text-xl font-semibold mb-2 mr-96">Dados da Escala</h1>
                                    <button onClick={closeCard} className="bg-red-400 hover:bg-red-500 text-white font-bold px-4 rounded">X</button>
                                </div>
                                <h2 className="text-xl font-semibold mb-2 mr-96">Referente ao dia {timerecords?.data}</h2>
                                <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleSaveTimerecords)}>
                                    <div className="rounded-md shadow-sm -space-y-px">
                                        <div className="pb-5">
                                            <label>Entrada</label>
                                            <InputMask
                                                {...register('entrada')}
                                                mask="99:99:99"
                                                id="entrada"
                                                name="entrada"
                                                type="entrada"
                                                required
                                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                placeholder="Digite o horario que voce entrou"
                                                defaultValue={timerecords?.entrada ? timerecords.entrada: '' }
                                            />
                                        </div>
                                        <div className="pb-5">
                                            <label>Saida para o Almoco</label>
                                            <InputMask
                                                {...register('almoco_saida')}
                                                mask="99:99:99"
                                                id="almoco_saida"
                                                name="almoco_saida"
                                                type="almoco_saida"
                                                required
                                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                placeholder="Digite o horario que voce saiu"
                                                defaultValue={timerecords?.almoco_saida ? timerecords.almoco_saida: '' }
                                            />
                                        </div>
                                        <div className="pb-5">
                                            <label>Volta do Almoco</label>
                                            <InputMask
                                                {...register('almoco_retorno')}
                                                mask="99:99:99"
                                                id="almoco_retorno"
                                                name="almoco_retorno"
                                                type="almoco_retorno"
                                                required
                                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                placeholder="Digite o horario que voce saiu"
                                                defaultValue={timerecords?.almoco_retorno ? timerecords.almoco_retorno: '' }
                                            />
                                        </div>
                                        <div>
                                            <label>Saida</label>
                                            <InputMask
                                                {...register('saida')}
                                                mask="99:99:99"
                                                id="saida"
                                                name="saida"
                                                type="saida"
                                                required
                                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                placeholder="Digite o horario que voce saiu"
                                                defaultValue={timerecords?.saida ? timerecords.saida: '' }
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    </span>
                                            { timerecords?.id ? <p>Editar cadastro da Escala</p> : <p>Cadastrar Escala</p>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {
                            success ? (
                                <div role="alert">
                                    <div className="bg-green-500 text-white font-bold rounded-t px-4 py-4">
                                        { timerecords?.id ? <p>Registro editado com sucesso</p> : <p>Registro cadastrado com sucesso</p>}
                                    </div>
                                </div>
                            ) : ''
                        }

                        {(errors?.entrada || errors?.almoco_saida || errors?.almoco_retorno || errors?.saida) ? (
                            <div role="alert">
                                <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                                    Danger
                                </div>
                                <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                                    <p>{errors?.entrada ? errors?.entrada : ''}</p>
                                    <p>{errors?.almoco_saida ? errors?.almoco_saida : ''}</p>
                                    <p>{errors?.almoco_retorno ? errors?.almoco_retorno : ''}</p>
                                    <p>{errors?.saida ? errors.saida : ''}</p>
                                </div>
                            </div>
                        ) : ''}

                    </div>
                ) : (
                    <div className="px-4 py-6 sm:px-0">
                        <TableTimeRecords onEdit={timeRecordEdit}/>
                    </div>
                )}
            </main>
        </div>
    )
}

export const getServerSideProps = withAuthServerSideProps('/');