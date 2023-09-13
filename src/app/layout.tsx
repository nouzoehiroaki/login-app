import type { Metadata } from 'next'
import '@/styles/globals.scss'
import { AuthProvider } from '@/lib/firebase/context/auth'
export const metadata: Metadata = {
    title: 'Login App',
    description: '新規登録・ログインの機能があり、ログインしたユーザーのみが閲覧できるページがあるWebアプリ 中級編',
}
export default function RootLayout({
    children,
} : {
    children: React.ReactNode
}){
    return (
        <html lang='ja'>
            <body>
                <AuthProvider>
                {children}
                </AuthProvider>
            </body>
        </html>
    )
}