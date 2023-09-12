'use client'
import { logout as logoutFunction } from '@/lib/firebase/apis/auth'
import UserGuard from '../lib/firebase/apis/user-guard'
import { useEffect } from 'react'
import { useAuth } from '../lib/firebase/context/auth'
export default function HomeScreen() {
    const user = useAuth();
    useEffect(() => {
        console.log(user);
    }, [user]);
    return (
        <UserGuard>
            <div>
                <p>ホーム画面</p>
                <p>
                    {user?.username ? `ようこそ、${user.username}さん` : 'ユーザー情報がありません'}
                </p>
                <div>
                    <button onClick={logoutFunction}>ログアウト</button>
                </div>
            </div>
        </UserGuard>
    )
}