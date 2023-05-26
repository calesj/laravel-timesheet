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

    // VERIFICA SE EXISTE UM TOKEN SALVO NO NAVEGADOR,
    // SE EXISTIR, ELE VAI FAZER A REQUISICAO NA API COM ESSE TOKEN,
    // RETORNANDO OS DADOS DO USUARIO
    useEffect( () => {
        const token = parseCookies()

        // VERIFICA SE EXISTE O TOKEN m2_token
        if(token.m2_token) {
            getUser(token.m2_token) // SE EXISTIR, ELE TENTA FAZER A REQUISICAO NA API, COM ESSE TOKEN
                .then((response => {
                    setUser(response?.data) // SE DER SUCESSO, ELE VAI PREENCHER AS INFORMACOES DO `userState` COM OS DADOS VINDO DA API
            })) .catch((e) => {
                console.log(e) // SE DER ERRO, VAI IMPRIMIR O ERRO NO CONSOLE
            })
        }
    }, [])


    // METODO RESPONSAVEL POR TRAZER OS DADOS DO USUARIO ATRAVES DO TOKEN
    function getUser (token: string) {
        return axios.get('http://127.0.0.1:8000/api/user', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
    }

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

        <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
            {children}
        </AuthContext.Provider>
    )
}
