'use client'
import { useEffect } from 'react'
import { usePathname,useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import { User } from '../types/user'
import { useAuth } from '../context/auth'

type Props = {
    children: ((user: User) => ReactNode) | ReactNode
}

const UserGuard = ({ children }: Props) => {
    const user = useAuth()
    const pathname = usePathname()
    const router = useRouter()
    useEffect(() => {
        if (user === null && pathname !== '/signin') {
            //window.location.href = '/signin'
            router.push('/signin')
        }
    }, [user, pathname, router])

    if (!user) {
        return null
    }

    if (typeof children === 'function') {
        // 関数であればユーザー情報を渡して実行
        return <>{children(user)}</>
    } else {
        // Nodeであればそのまま表示
        return <>{children}</>
    }
}

export default UserGuard
