import {Fragment, useContext, useEffect} from 'react'
import {Disclosure, Menu, Transition} from '@headlessui/react'
import {MenuIcon, XIcon} from '@heroicons/react/outline'
import {AuthContext} from "@/contexts/AuthContext"
import {api} from "@/services/api"
import {GetServerSideProps} from "next"
import {destroyCookie, parseCookies} from "nookies"
import {useRouter} from "next/router";
import {getAPIClient} from "@/services/axios";
import Head from 'next/head'
import TableCollaborators from "@/components/tableCollaborators";
const navigation = ['Dashboard', 'Escalas', 'Projects', 'Calendar', 'Reports']

export default function Timescale() {
    const {user, signOut, getUser} = useContext(AuthContext)
    const router = useRouter()

    useEffect(() => {
            getUser()
        },
        [])
    // METODO SAIR
    function exit() {
        // METODO RESPONSAVEL POR DESTRUIR O COOKIE DO TOKEN, E REDIRECIONAR PRA TELA INICIAL
        signOut()
    }

    return (
        <div>
            <Head>
                <title>Dashboard</title>
            </Head>

            <Disclosure as="nav" className="bg-gray-800">
                {({open}) => (
                    <>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between h-16">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <img
                                            className="h-8 w-8"
                                            src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                                            alt="Workflow"
                                        />
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-10 flex items-baseline space-x-4">
                                            {navigation.map((item, itemIdx) =>
                                                itemIdx === 0 ? (
                                                    <Fragment key={item}>
                                                        {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                                                        <a href=''
                                                           className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">
                                                            {item}
                                                        </a>
                                                    </Fragment>
                                                ) : (
                                                    <a
                                                        key={item}
                                                        href={item.toLowerCase()}
                                                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                                    >
                                                        {item}
                                                    </a>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:block">
                                    <div className="ml-4 flex items-center md:ml-6">
                                        <div>
                                            <b className='text-white'>{(user && user.name) ? user.name : ''}</b>
                                        </div>
                                        <a
                                            onClick={exit}
                                            key='exit'
                                            href=""
                                            className="ml-5 text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-[15px] font-medium"
                                        >
                                            Sair
                                        </a>
                                    </div>
                                </div>
                                <div className="-mr-2 flex md:hidden">
                                    {/* Mobile menu button */}
                                    <Disclosure.Button
                                        className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XIcon className="block h-6 w-6" aria-hidden="true"/>
                                        ) : (
                                            <MenuIcon className="block h-6 w-6" aria-hidden="true"/>
                                        )}
                                    </Disclosure.Button>
                                </div>
                            </div>
                        </div>
                        <Disclosure.Panel className="md:hidden">
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                                {navigation.map((item, itemIdx) =>
                                    itemIdx === 0 ? (
                                        <Fragment key={item}>
                                            {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                                            <a href="#"
                                               className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium">
                                                {item}
                                            </a>
                                        </Fragment>
                                    ) : (
                                        <a
                                            key={item}
                                            href="#"
                                            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                        >
                                            {item}
                                        </a>
                                    )
                                )}
                            </div>
                            <div className="pt-4 pb-3 border-t border-gray-700">
                                <div className="flex items-center px-5">
                                    <div className="ml-3">
                                        <div
                                            className="text-base font-medium leading-none text-white">{(user && user.name) ? user.name : ''}</div>
                                        <div
                                            className="text-sm font-medium leading-none text-gray-400">{(user && user.email) ? user.email : ''}</div>
                                    </div>
                                </div>
                                <div className="mt-3 px-2 space-y-1">
                                    <a
                                        onClick={signOut}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                                    >
                                        Sign out
                                    </a>
                                </div>
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>

            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                </div>
            </header>
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <TableCollaborators/>
                    </div>
                </div>
            </main>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    // PASSANDO O CONTEXTO DA REQUISICAO
    const apiClient = getAPIClient(ctx) // METODO RESPONSAVEL POR COLOCAR O TOKEN NO CABECALHO DE TODA REQUISICAO QUE NOS FAZERMOS FUTURAMENTE

    const token = parseCookies(ctx)

    if (!token.m2_token) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const response = await apiClient.get('/user')
        .then((response => {
            return response.data
        }))
        .catch((e => {
            console.log(e)
        }))

    if(!response) {
        destroyCookie(ctx, 'm2_token') // DESTROI O COOKIE, E REDIRECIONA PRA TELA DE LOGIN
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }


    return {
        props: {}
    }
}