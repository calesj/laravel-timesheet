import {createContext, useState} from "react"
import {useRouter} from "next/router";
import axios from "axios"
import {api                                                                                                                                 } from "@/services/api";
import Cookies from "js-cookie";
import {FieldValues} from "react-hook-form";

// TIPAGEM DO USUARIO
type User = {
    name: string
    email: string,
    collaborator: {
        id: string | number,
        matricula: string,
        cpf: string,
        user_id: string | number,
        timescale_id: string | number,
        time_records: []
    }
}

type AuthContextType = {
    isAuthenticated: boolean
    user: User | null
    getUser: (route?: string | null) => Promise<void>
    signIn: (data: FieldValues) => Promise<void>
}


// AQUI ESTAMOS DIZENDO QUE O NOSSO CONTEXTO, PRECISA TER O FORMATO DO AuthContextType
export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // O ESTADO user, VAI UTILIZAR OS CAMPOS DO TYPE `User`, PODENDO SER UM `User` OU `null`, E COMECANDO DE VALOR `null`
    const [user, setUser] = useState<User | null>(null);

    const isAuthenticated = !!user;

    const router = useRouter()

    // METODO RESPONSAVEL, POR VERIFICAR SE JA EXISTE ALGUEM AUTENTICADO
    // SE TIVER, ELE REDIRECIONA PARA A PAGINA DE DASHBOARD
    // E SETA AS INFORMACOES DO USUARIO
    async function getUser(route: string | null | undefined = null) {
        const token = Cookies.get('m2_token')
        if (token) {
            let response =  await api.get('/user')
                .then((response => {
                    return response
                }))
                .catch((e => {
                    // DESTROI O COOKIE
                    Cookies.remove('m2_token') // DESTROI O COOKIE
                }));
            // VERIFICA SE EXISTE UM id, DENTRO DO OBJETO, E SE ELE NAO ESTA VAZIO
            if (response?.data.id && response.data.id !== '') {
                setUser(response.data)

                // VERIFICA SE ESTAO PASSANDO UMA ROTA NO PARAMETRO, SE EXISTIR UMA ROTA, ELE REDIRECIONA ATE ELA
                if (route) {
                    router.push(`/${route}`)
                }

            } else {
                Cookies.remove('m2_token') // DESTROI O COOKIE, E REDIRECIONA PRA TELA DE LOGIN
            }
        }
    }

    // METODO RESPONSAVEL, POR LOGAR NA SUA CONTA
    const signIn = async (data: FieldValues): Promise<void> => {
        const { email, password } = data;
        const response = await axios.post(
            "https://m2-server-production.up.railway.app/api/login",
            {
                email,
                password,
            }
        );

        if (response.data.access_token) {
            Cookies.set("m2_token", response.data.access_token, {
                expires: 10 / (24 * 60), // TEMPO DE DURACAO DO TOKEN
            });

            api.defaults.headers["Authorization"] = `Bearer ${response.data.access_token}`;

            setUser(response.data.user);

            router.push("/dashboard");
        }
    }

    return (

        <AuthContext.Provider value={{ user: user !== null ? user : {} as User, getUser, isAuthenticated, signIn }}>
            {children}
        </AuthContext.Provider>
    )
}
