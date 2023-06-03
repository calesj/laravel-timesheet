import Head from 'next/head'
import Header from "@/components/header";
import {withAuthServerSideProps} from "@/components/getServerSideProps/getServerSideProps";
import {useForm} from 'react-hook-form';
import React, {useState} from "react";
import InputMask from 'react-input-mask';
import {api} from "@/services/api";
import TableTimeRecords from "@/components/tables/tableTimeRecords";

export default function Timescale() {
    const { register, handleSubmit, reset } = useForm();
    const [card, setCard] = useState(false)
    const [errors, setErrors] = useState([])
    const [success, setSuccess] = useState(false)
    const [timescale, setTimescale] = useState('')

    async function openCard() {
        setSuccess(false)
        setErrors([])
        setCard(true)
        reset()
    }

    async function closeCard() {
        setTimescale('')
        setSuccess(false)
        setErrors([])
        setCard(false)
        reset()
    }

    // METODO RESPONSAVEL POR CADASTRAR A ESCALA NO BANCO
    async function handleSaveTimescale(data) {
        data.data = timescale.data
        const response = await api.put(`time_record/update/${timescale?.collaborator_id}`, data)
                .then(response => {
                    if (response.data.id) {
                        setErrors([])
                        setSuccess(true)
                        setTimescale(response.data)
                    }
                }).catch(e => {
                    setErrors(e.response.data.errors)
                })
        console.log(response)
        reset()
    }

    const timeRecordEdit = (item) => {
        setTimescale(item)
        openCard()
    }
    return (
        <div>
            <Head>
                <title>Escalas</title>
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
                                <h2 className="text-xl font-semibold mb-2 mr-96">Referente ao dia {timescale.data}</h2>
                                <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleSaveTimescale)}>
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
                                                defaultValue={timescale.entrada ? timescale.entrada: '' }
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
                                                defaultValue={timescale.almoco_saida ? timescale.almoco_saida: '' }
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
                                                defaultValue={timescale.almoco_retorno ? timescale.almoco_retorno: '' }
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
                                                defaultValue={timescale.saida ? timescale.saida: '' }
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
                                            { timescale.id ? <p>Editar cadastro da Escala</p> : <p>Cadastrar Escala</p>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {
                            success ? (
                                <div role="alert">
                                    <div className="bg-green-500 text-white font-bold rounded-t px-4 py-4">
                                        { timescale.id ? <p>Registro editado com sucesso</p> : <p>Registro cadastrado com sucesso</p>}
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