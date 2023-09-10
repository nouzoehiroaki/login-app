'use client'
import NextLink from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from '@/styles/signup.module.scss'
import { signUpWithEmail } from '@/lib/firebase/apis/auth'

type formInputs = {
    email: string
    password: string
    confirm: string
}
/** サインアップ画面
 * @screenname SignUpScreen
 * @description ユーザの新規登録を行う画面
 */
export default function SignUpScreen() {
    const { handleSubmit, register } = useForm<formInputs>()
    const [password, setPassword] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const onSubmit = handleSubmit(async (data) => {
        signUpWithEmail({ email: data.email, password: data.password }).then(
            (res: boolean) => {
              if (res) {
                console.log('新規登録成功')
              } else {
                console.log('新規登録失敗')
              }
            }
        )
    })
    const passwordClick = () => setPassword(!password)
    const confirmClick = () => setConfirm(!confirm)

    return(
        <div className={styles.flexContainer}>
            <div className={styles.vstack}>
                <h1>新規登録</h1>
                <form onSubmit={onSubmit}>
                    <div className={styles.vstackInner}>
                        <div className={styles.formControl}>
                            <label htmlFor='email'>メールアドレス</label>
                            <input id='email' {...register('email')} />
                        </div>
                        <div className={styles.formControl}>
                            <label htmlFor='password'>パスワード</label>
                            <div className={styles.inputGroup}>
                                <input
                                    type={password ? 'text' : 'password'}
                                    {...register('password')}
                                />
                                <button onClick={passwordClick}>
                                    {password ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>
                        <div className={styles.formControl}>
                            <label htmlFor='confirm'>パスワード確認</label>
                            <div className={styles.inputGroup}>
                                <input
                                    type={confirm ? 'text' : 'password'}
                                    {...register('confirm')}
                                />
                                <button onClick={confirmClick}>
                                    {confirm ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>
                        <button className={styles.loginBtn} type='submit'>
                            新規登録
                        </button>
                        <NextLink href='/signin' className={styles.signupLink}>
                            <button className={styles.signupBtn}>ログインはこちらから</button>
                        </NextLink>
                    </div>
                </form>
            </div>
        </div>
    )
}