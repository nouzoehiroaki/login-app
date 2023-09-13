'use client'
import { logout as logoutFunction } from '@/lib/firebase/apis/auth'
import UserGuard from '../lib/firebase/apis/user-guard'
import { useEffect } from 'react'
import { useAuth } from '../lib/firebase/context/auth'
import styles from '@/styles/Form.module.scss'
export default function HomeScreen() {
    const user = useAuth();
    useEffect(() => {
        console.log(user);
    }, [user]);
    return (
        <UserGuard>
            <div>
                <p>ホーム画面</p>
                <div>
                    <button onClick={logoutFunction}>ログアウト</button>
                </div>
                <a href='/mypage' className={styles.signupLink}>
                    <button className={styles.signupBtn}>マイページへ</button>
                </a>
            </div>
        </UserGuard>
    )
}