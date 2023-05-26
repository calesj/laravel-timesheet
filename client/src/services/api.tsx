import axios from "axios"
import {parseCookies} from 'nookies'

// PEGA TODOS OS TOKENS DO BROWSER
const token = parseCookies()

// CRIAMOS UMA CONSTANTE QUE FAZ UMA REQUISICAO NA URL PADRAO DA API
export const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/'
})

// VERIFICA SE EXISTE UM TOKEN CHAMADO `m2_token`
if (token.m2_token) {
    // SE EXISTIR, ELE VAI COLOCAR ELE NO CABECALHO DA CONSTANTE `api`, FAZENDO COM QUE QUALQUER REQUISICAO QUE VOCE FA;A
    // JA ENVIE O TOKEN AUTOMATICAMENTE
    api.defaults.headers['Authorization'] = `Bearer ${token.m2_token}`;
}