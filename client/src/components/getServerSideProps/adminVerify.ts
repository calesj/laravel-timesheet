import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {destroyCookie, parseCookies} from "nookies";
import axios from "axios";

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

        axios.defaults.headers['Authorization'] = `Bearer ${cookies.m2_token}`
        const response = await axios.get('http://127.0.0.1:8000/api/admin/').catch(e => {
            return {
                redirect: {
                    destination: redirectPath,
                    permanent: false,
                },
            };
        })

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