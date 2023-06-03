import {Fragment, useContext, useEffect, useState} from "react";
import {Disclosure} from "@headlessui/react";
import {MenuIcon, XIcon} from "@heroicons/react/outline";
import {AuthContext} from "@/contexts/AuthContext";
import {useRouter} from "next/router";
import Cookies from "js-cookie";
import {api} from "@/services/api";
const navigation = [
    {label: 'Dashboard', route: 'dashboard'},
    {label: 'Minha Escala', route: 'escalas'},
]


export default function Header() {

    const {user, getUser} = useContext(AuthContext)
    const [admin, setAdmin] = useState(false)
    const router = useRouter()

    useEffect( () => {
            async function fetchData() {
                const response = await api.get('/admin').catch(e => {
                    console.log('Algo deu errado')
                })
                if (response?.data?.user_privilege?.id && response?.data?.user_privilege?.id === 2) {
                    setAdmin(true)
                }
            }

            fetchData()
            getUser()
        },
        [])
    // METODO SAIR
    function exit() {
        // Destruir o cookie
        Cookies.remove('m2_token');

        // Redirecionar para a página de login
        router.replace("/");
    }

    return (
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
                                        {navigation.map((item) => (
                                            <a
                                                key={item.label}
                                                href={"../../" + item.route}
                                                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                            >
                                                {item.label}
                                            </a>
                                        ))}
                                        {
                                            admin ? (
                                                <>
                                                    <a
                                                        key="admin/dashboard"
                                                        href="../../admin/dashboard"
                                                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                                    >
                                                        Admin/Funcionarios
                                                    </a>
                                                    <a
                                                        key="admin/escalas"
                                                        href="../../admin/escalas"
                                                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                                    >
                                                        Admin/Escalas
                                                    </a>
                                                </>
                                            ) : ''
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-4 flex items-center md:ml-6">
                                    <div>
                                        <b className='text-white'>{(user && user.name) ? user.name : ''}</b>
                                    </div>
                                    <button
                                        onClick={exit}
                                        key="exit"
                                        className="ml-5 text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-[15px] font-medium"
                                    >Sair</button>
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
                                    <Fragment key={item.label}>
                                        <a href={"../../" + item.route}
                                           className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                                            {item.label}
                                        </a>
                                    </Fragment>
                                ) : (
                                    <a
                                        key={item.label}
                                        href={"../../" + item.route}
                                        className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                    >
                                        {item.label}
                                    </a>
                                )
                            )}
                            {
                                admin ? (
                                    <>
                                        <a
                                            key="admin/dashboard"
                                            href="../../admin/dashboard"
                                            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                        >
                                            Admin/Funcionarios
                                        </a>
                                        <a
                                            key="admin/escalas"
                                            href="../../admin/escalas"
                                            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                        >
                                            Admin/Escalas
                                        </a>
                                    </>
                                ) : ''
                            }
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
                                <button
                                    onClick={exit}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                                >
                                    Sair
                                </button>
                            </div>
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}

