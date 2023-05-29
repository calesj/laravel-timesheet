import axios from "axios";
import {parseCookies} from "nookies";

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/'
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Redirecionar para a página de login
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export function getAPIClient(ctx?: any) {
    // PEGA TODOS OS TOKENS DO BROWSER
    const token = parseCookies(ctx);

    // VERIFICA SE EXISTE UM TOKEN CHAMADO `m2_token`
    // SE EXISTIR, ELE VAI COLOCAR ELE NO CABECALHO DA CONSTANTE `api`, FAZENDO COM QUE QUALQUER REQUISICAO QUE VOCE FA;A
    if (token.m2_token) {
        api.defaults.headers['Authorization'] = `Bearer ${token.m2_token}`;
    }

    return api;
}
