import {createContext, useEffect, useState} from "react"
import {useRouter} from "next/router";
import {parseCookies, setCookie} from 'nookies'
import axios from "axios"
import {api} from "@/services/api";

type User = {
    name: string
    email: string,
}

type SignInData = {
    email: string;
    password: string;
}

type AuthContextType = {
    isAuthenticated: boolean;
    user: User
    signIn: (data: SignInData) => Promise<void>
}


// AQUI ESTAMOS DIZENDO QUE O NOSSO CONTEXTO, PRECISA TER O FORMATO DO AuthContextType
export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({children}) {
    // O ESTADO user, VAI UTILIZAR OS CAMPOS DO TYPE `User`, PODENDO SER UM `User` OU `null`, E COMECANDO DE VALOR `null`
    const [user, setUser] = useState<User | null>(null);

    const isAuthenticated = !!user;

    const router = useRouter()

    // METODO RESPONSAVEL, POR LOGAR NA SUA CONTA
    async function signIn({email, password}: SignInData) {
        const response  = await axios.post('http://127.0.0.1:8000/api/login', {
          email, password
        })

        setCookie(undefined, 'm2_token', response.data.access_token, {
        maxAge: 60 * 29, // TEMPO DE DURACAO DO TOKEN
        })

        api.defaults.headers['Authorization'] = `Bearer ${response.data.access_token}`

        setUser(response.data.user)

        router.push('/dashboard')
    }

    return (

        <AuthContext.Provider value={{ user, isAuthenticated, signIn}}>
            {children}
        </AuthContext.Provider>
    )
}
