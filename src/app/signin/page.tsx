'use client'
import NextLink from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from '@/styles/signup.module.scss'
import { signInWithEmail } from '@/lib/firebase/apis/auth'

type formInputs = {
    email: string
    password: string
}
/** サインイン画面
 * @screenname SignInScreen
 * @description ユーザのサインインを行う画面
 */
export default function SignInScreen() {
    const { handleSubmit, register } = useForm<formInputs>()
    const [show, setShow] = useState<boolean>(false)
    const onSubmit = handleSubmit(async (data) => {
        signInWithEmail({ email: data.email, password: data.password }).then(
            (res: boolean) => {
              if (res) {
                console.log('ログイン成功')
              } else {
                console.log('ログイン失敗')
              }
            }
        )
    })
    return(
        <div className={styles.flexContainer}>
            <div className={styles.vstack}>
                <h1>ログイン</h1>
                <form onSubmit={onSubmit}>
                    <div className={styles.vstackInner}>
                        <div className={styles.formControl}>
                            <label htmlFor='email'>メールアドレス</label>
                            <input id='email' {...register('email')} />
                        </div>
                        <div className={styles.formControl}>
                            <label htmlFor='password'>パスワード</label>
                            <div className={styles.inputGroup}>
                                <input type={show ? 'text' : 'password'} {...register('password')} />
                                <button onClick={() => setShow(!show)}>
                                {show ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>
                        <button className={styles.loginBtn}>ログイン</button>
                        <NextLink href='/signup' className={styles.signupLink}>
                            <button className={styles.signupBtn}>新規登録はこちらから</button>
                        </NextLink>
                    </div>
                </form>
            </div>
        </div>
    )
}