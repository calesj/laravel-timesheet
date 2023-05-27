import {getAPIClient} from "@/services/axios";

// UTILIZAMOS ESSE METODO PRA FAZER CHAMADAS APARTIR DO BROWSER
// JA QUE NAO ESTAMOS PASSANDO NENHUM `ctx` COMO PARAMETRO
export const api = getAPIClient()