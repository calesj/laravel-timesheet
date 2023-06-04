import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {destroyCookie, parseCookies} from "nookies";
import axios, {AxiosResponse} from "axios";

interface AdminData {
    id: string;
    // outras propriedades da resposta
}
export const adminVerify = (redirectPath = '/'): GetServerSideProps => {
    return async (ctx: GetServerSidePropsContext) => {
        const { req, res } = ctx;

        const cookies = parseCookies({ req });

        if (!cookies.m2_token) {
            return {
                redirect: {
                    destination: redirectPath,
                    permanent: false,
                },
            };
        }
        let response: AxiosResponse<AdminData>;
        axios.defaults.headers['Authorization'] = `Bearer ${cookies.m2_token}`
        try {
            response = await axios.get('https://m2-server-production.up.railway.app/api/admin/');
        } catch (error) {
            return {
                redirect: {
                    destination: redirectPath,
                    permanent: false,
                },
            };
        }

        if (!response.data?.id) {
            return {
                redirect: {
                    destination: redirectPath,
                    permanent: false,
                },
            };
        }

        return {
            props: {},
        };
    };
};

export const signOut = (ctx: GetServerSidePropsContext) => {
    destroyCookie(ctx, 'm2_token');
};