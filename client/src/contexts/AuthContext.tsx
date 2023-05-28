import {createContext, Dispatch, useEffect, useState} from "react"
import {useRouter} from "next/router";
import {destroyCookie, parseCookies, setCookie} from 'nookies'
import axios from "axios"
import {api} from "@/services/api";

// TIPAGEM DO USUARIO
type User = {
    name: string
    email: string,
}

// TIPAGEM DE LOGIN
type SignInData = {
    email: string;
    password: string;
}

// TIPAGEM DE REGISTRO
type registerInData = {
    name: string,
    email: string;
    password: string;
}

type AuthContextType = {
    isAuthenticated: boolean;
    user: User
    getUser: any
    signIn: (data: SignInData) => Promise<void>
    signOut: any
    registerIn: (data: registerInData) => Promise<void>
}


// AQUI ESTAMOS DIZENDO QUE O NOSSO CONTEXTO, PRECISA TER O FORMATO DO AuthContextType
export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({children}) {
    // O ESTADO user, VAI UTILIZAR OS CAMPOS DO TYPE `User`, PODENDO SER UM `User` OU `null`, E COMECANDO DE VALOR `null`
    const [user, setUser] = useState<User | null>(null);

    const isAuthenticated = !!user;

    const router = useRouter()

    // METODO RESPONSAVEL, POR VERIFICAR SE JA EXISTE ALGUEM AUTENTICADO
    // SE TIVER, ELE REDIRECIONA PARA A PAGINA DE DASHBOARD
    // E SETA AS INFORMACOES DO USUARIO
    async function getUser(route = null) {
        const token = parseCookies()
        if (token.m2_token) {
            let response =  await api.get('/user')
                .then((response => {
                    return response
                }))
                .catch((e => {
                    // DESTROI O COOKIE
                    destroyCookie(undefined, 'm2_token') // DESTROI O COOKIE
                }));
            // VERIFICA SE EXISTE UM id, DENTRO DO OBJETO, E SE ELE NAO ESTA VAZIO
            if (response?.data.id && response.data.id !== '') {
                setUser(response.data)

                // VERIFICA SE ESTAO PASSANDO UMA ROTA NO PARAMETRO, SE EXISTIR UMA ROTA, ELE REDIRECIONA ATE ELA
                if (route) {
                    router.push(`/${route}`)
                }

            } else {
                destroyCookie(undefined, 'm2_token') // DESTROI O COOKIE, E REDIRECIONA PRA TELA DE LOGIN
            }
        }
    }

    // METODO RESPONSAVEL, POR REGISTRAR UMA CONTA DE USUARIO
    async function registerIn({name, email, password}: registerInData) {
        const response  = await axios.post('http://127.0.0.1:8000/api/register', {
            name, email, password
        })

        if (response.data.access_token) {
            setCookie(undefined, 'm2_token', response.data.access_token, {
                maxAge: 60 * 29, // TEMPO DE DURACAO DO TOKEN
            })

            api.defaults.headers['Authorization'] = `Bearer ${response.data.access_token}`

            setUser(response.data.user)

            router.push('/dashboard')
        }

        return response
    }

    // METODO RESPONSAVEL, POR LOGAR NA SUA CONTA
    async function signIn({email, password}: SignInData) {
        const response  = await axios.post('http://127.0.0.1:8000/api/login', {
          email, password
        })

        if (response.data.access_token) {
            setCookie(undefined, 'm2_token', response.data.access_token, {
                maxAge: 60 * 29, // TEMPO DE DURACAO DO TOKEN
            })

            api.defaults.headers['Authorization'] = `Bearer ${response.data.access_token}`

            setUser(response.data.user)

            router.push('/dashboard')
        }

        return response;
    }

    // METODO SAIR
    function signOut() {
        // METODO RESPONSAVEL POR DESTRUIR O COOKIE DO TOKEN, E REDIRECIONAR PRA TELA INICIAL
        destroyCookie(undefined, 'm2_token')
        router.push('/')
    }

    return (

        <AuthContext.Provider value={{ user, getUser, isAuthenticated, signIn, signOut, registerIn }}>
            {children}
        </AuthContext.Provider>
    )
}
