import Head from 'next/head'
import TableCollaborators from "@/components/tables/tableCollaborators";
import Header from "@/components/header";
import {useForm} from 'react-hook-form';
import React, {useState} from "react";
import {api} from "@/services/api";
import {adminVerify} from "@/components/getServerSideProps/adminVerify";

export default function Dashboard() {

    const {register, handleSubmit, reset } = useForm();
    const [card, setCard] = useState(false)
    const [collaborator, setCollaborator] = useState('')
    const [errors, setErrors] = useState([])
    const [success, setSuccess] = useState(false)
    const [timescale, setTimescale] = useState([])
    async function openCard() {
        const response = await api.get('timescale')
        setTimescale(response.data)
        setSuccess(false)
        setErrors([])
        setCard(true)
        reset()
    }

    async function closeCard() {
        setCollaborator('')
        setTimescale([])
        setSuccess(false)
        setErrors([])
        setCard(false)
        reset()
    }

    // METODO RESPONSAVEL POR CADASTRAR OU EDITAR O COLABORADOR NO BANCO
    async function handleSaveCollaborator(data) {
        const response = !collaborator.id ? await api.post('register', data)
            .then(response => {
                if (response.data.id) {
                    setCollaborator('')
                    setErrors([])
                    setSuccess(true)
                }
            }).catch(e => {
                setErrors(e.response.data.errors)
            }) :
            (await api.put(`update/${collaborator?.user?.id}`, data)
                .then(response => {
                    if (response.data.id) {
                        setErrors([])
                        setSuccess(true)
                        setCollaborator(response.data)
                    }
                }).catch(e => {
                    setErrors(e.response.data.errors)
                }))

        reset()
    }

    const collaboratorEdit = (item) => {
        setCollaborator(item)
        openCard()
    }
    return (
        <div>
            <Head>
                <title>Dashboard</title>
            </Head>

            {
                // COMPONENTE HEADER DA PAGINA
            }
            <Header/>

            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Todos os Funcionarios Cadastrados - ADMIN</h1>
                </div>
            </header>
            <main>
                {card ? (
                    <div>
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        <div className="bg-white shadow-xl p-4 rounded-lg">
                            <div className="px-4 sm:px-0 flex justify-end">
                                <h2 className="text-xl font-semibold mb-2 mr-96">Dados do Colaborador</h2>
                                <button onClick={closeCard} className="bg-red-400 hover:bg-red-500 text-white font-bold px-4 rounded">X</button>
                            </div>
                            <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleSaveCollaborator)}>
                                <div className="rounded-md shadow-sm -space-y-px">
                                    <div>
                                        <input
                                            {...register('name')}
                                            id="name"
                                            name="name"
                                            type="name"
                                            required
                                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="Nome do colaborador"
                                            defaultValue={collaborator.user?.name ? collaborator?.user?.name: '' }
                                        />
                                    </div>
                                    <div>
                                        <input
                                            {...register('matricula')}
                                            id="matricula"
                                            name="matricula"
                                            type="matricula"
                                            required
                                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="Matricula do colaborador"
                                            defaultValue={collaborator.matricula ? collaborator.matricula: '' }
                                        />
                                    </div>
                                    <div>
                                        <input
                                            {...register('cpf')}
                                            id="cpf"
                                            name="cpf"
                                            type="cpf"
                                            required
                                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="CPF do colaborador"
                                            defaultValue={collaborator.cpf ? collaborator.cpf: '' }
                                        />
                                    </div>
                                    <div>
                                        <input
                                            {...register('email')}
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="E-mail do colaborador"
                                            defaultValue={collaborator?.user?.email ? collaborator?.user?.email: '' }
                                        />
                                    </div>
                                    {
                                        !collaborator.id ?
                                    (<div>
                                        <input
                                            {...register('password')}
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="Senha do colaborador"
                                        />
                                    </div>) : ''
                                    }
                                    <div>
                                        <select
                                            {...register('timescale_id')}
                                            id="timescale_id"
                                            name="timescale_id"
                                            required
                                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="Escolha a escala"
                                        >
                                            {timescale && timescale.map(item => (
                                                <option key={item.id} value={item.id} selected={item.id === collaborator?.timescale_id}>
                                                    {item.nome} - {item.entrada} as {item.saida}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    </span>
                                        { collaborator.id ? <p>Editar Registro</p> : <p>Cadastrar Registro</p>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                        {
                            success ? (
                                <div role="alert">
                                    <div className="bg-green-500 text-white font-bold rounded-t px-4 py-4">
                                        { collaborator.id ? <p>Registro editado com sucesso</p> : <p>Registro cadastrado com sucesso</p>}
                                    </div>
                                </div>
                            ) : ''
                        }

                        {(errors?.name || errors?.matricula || errors?.cpf || errors?.email || errors?.password) ? (
                            <div role="alert">
                                <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                                    Danger
                                </div>
                                <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                                    <p>{errors.name ? errors.name : ''}</p>
                                    <p>{errors.matricula ? errors.matricula : ''}</p>
                                    <p>{errors.cpf ? errors.cpf : ''}</p>
                                    <p>{errors.email ? errors.email : ''}</p>
                                    <p>{errors.password ? errors.password : ''}</p>
                                </div>
                            </div>
                        ) : ''}

                    </div>
                ) : (
                    <div className="px-4 py-6 sm:px-0">
                        <div className="px-4 py-6 sm:px-0 flex justify-end">
                            <button onClick={openCard} className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded">
                                Adicionar Colaborador
                            </button>
                        </div>
                        <TableCollaborators onEdit={collaboratorEdit}/>
                    </div>
                )}
            </main>
        </div>
    )
}



export const getServerSideProps = adminVerify('/dashboard');

