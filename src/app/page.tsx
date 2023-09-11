'use client'
import { logout as logoutFunction } from '@/lib/firebase/apis/auth'
import UserGuard from '../lib/firebase/apis/user-guard'
export default function HomeScreen() {
    return (
        <UserGuard>
            <div>
                <p>ホーム画面</p>
                <div>
                    <button onClick={logoutFunction}>ログアウト</button>
                </div>
            </div>
        </UserGuard>
    )
}