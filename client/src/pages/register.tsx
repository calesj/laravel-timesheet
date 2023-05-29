import Head from 'next/head'
import {LockClosedIcon} from "@heroicons/react/outline";
import {useForm} from 'react-hook-form';
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "@/contexts/AuthContext";

export default function Home() {
    const { register, handleSubmit } = useForm();
    const {getUser, registerIn} = useContext(AuthContext)
    const [errors, setErrors] = useState([])

    // VERIFICA SE EXISTE UM TOKEN SALVO NO NAVEGADOR,
    // SE EXISTIR, ELE VAI FAZER A REQUISICAO NA API COM ESSE TOKEN,
    // RETORNANDO OS DADOS DO USUARIO
    useEffect(() => {
        getUser('dashboard')
    }, []);

    // METODO RESPONSAVEL POR ENVIAR OS PARAMETROS DO FORMULARIO, AO METODO DE LOGAR DO CONTEXT
    async function handleRegister(data) {
        try {
            const response = await registerIn(data);
            console.log(response);
            // Realizar outras ações em caso de sucesso
        } catch (error) {
            if (error.response.data.errors && error.response.status === 422) {
                // Lidar com o erro 422 (Validação) de forma personalizada
                setErrors(error.response.data.errors)
            } else {
                // Lidar com outros erros de forma personalizada
                console.log('Ocorreu um erro na API');
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head>
                <title>Home</title>
            </Head>

            <div className="max-w-sm w-full space-y-8">
                <div>
                    <img
                        className="mx-auto h-12 w-auto"
                        src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                        alt="Workflow"
                    />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Crie sua conta!</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleRegister)}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                {...register('name')}
                                id="name"
                                name="name"
                                type="name"
                                autoComplete="name"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Nome"
                            />
                        </div>
                        <div>
                            <input
                                {...register('email')}
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Endereço de e-mail"
                            />
                        </div>
                        <div>
                            <input
                                {...register('password')}
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Senha"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <a href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Já tem uma conta? <b>Entrar</b>
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
              </span>
                            Registrar
                        </button>
                    </div>
                    {(errors.password || errors.name || errors.email) ? (
                        <div role="alert">
                            <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                                Danger
                            </div>
                            <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                                <p>{errors.nome ? errors.nome : '' }</p>
                                <p>{errors.email ? errors.email: '' }</p>
                                <p>{errors.password ? errors.password : '' }</p>
                            </div>
                        </div>
                    ) : ''}
                </form>
            </div>
        </div>
    )
}
