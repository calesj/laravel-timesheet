import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {destroyCookie, parseCookies} from "nookies";

export const withAuthServerSideProps = (redirectPath = '/'): GetServerSideProps => {
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

        return {
            props: {},
        };
    };
};

export const signOut = (ctx: GetServerSidePropsContext) => {
    destroyCookie(ctx, 'm2_token');
};