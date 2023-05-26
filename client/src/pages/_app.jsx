// _app.jsx
import '../app/globals.css'
import React from 'react'
import { AuthProvider } from "../contexts/AuthContext";

function MyApp({ Component, pageProps }) {
    return (
        <div>
            <AuthProvider>
                <Component {...pageProps} />
            </AuthProvider>
        </div>
    )
}

export default MyApp
