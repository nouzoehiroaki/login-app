'use client'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from '@/styles/signup.module.scss'
import { signUpWithEmail,FirebaseResult } from '@/lib/firebase/apis/auth'

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
    const router = useRouter()
    const { 
        handleSubmit, 
        register,
        getValues,
        formState: { errors, isSubmitting }
    } = useForm<formInputs>()
    const [password, setPassword] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [notification, setNotification] = useState<{ message: string, status: 'success' | 'error' | null }>({ message: '', status: null });

    const onSubmit = handleSubmit(async (data) => {
        await signUpWithEmail({ 
            email: data.email, 
            password: data.password 
        }).then((res: FirebaseResult) => {
              if (res.isSuccess) {
                setNotification({ message: res.message, status: 'success' });
              } else {
                setNotification({ message: res.message, status: 'error' });
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
                        <div className={errors.email ? `${styles.formControl} ${styles.invalid}` : styles.formControl}>
                            <label htmlFor='email'>メールアドレス</label>
                            <input 
                                id='email'
                                {...register('email', {
                                    required: '必須項目です',
                                    maxLength: {
                                        value: 50,
                                        message: '50文字以内で入力してください',
                                    },
                                    pattern: {
                                        value:
                                        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@+[a-zA-Z0-9-]+\.+[a-zA-Z0-9-]+$/,
                                        message: 'メールアドレスの形式が違います',
                                    },
                                })}
                            />
                            {errors.email && 
                                <span className={styles.errorMessage}>
                                    {errors.email.message}
                                </span>
                            }
                        </div>
                        <div className={errors.password ? `${styles.formControl} ${styles.invalid}` : styles.formControl}>
                            <label htmlFor='password'>パスワード</label>
                            <div className={styles.inputGroup}>
                                <input
                                    type={password ? 'text' : 'password'}
                                    {...register('password', {
                                        required: '必須項目です',
                                        minLength: {
                                            value: 8,
                                            message: '8文字以上で入力してください',
                                        },
                                        maxLength: {
                                            value: 50,
                                            message: '50文字以内で入力してください',
                                        },
                                        pattern: {
                                            value: /^(?=.*[A-Z])[0-9a-zA-Z]*$/,
                                            message:
                                            '半角英数字かつ少なくとも1つの大文字を含めてください',
                                        },
                                    })}
                                />
                                <button onClick={passwordClick}>
                                    {password ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            {errors.password && 
                                <span className={styles.errorMessage}>
                                    {errors.password.message}
                                </span>
                            }
                        </div>
                        <div className={errors.confirm ? `${styles.formControl} ${styles.invalid}` : styles.formControl}>
                            <label htmlFor='confirm'>パスワード確認</label>
                            <div className={styles.inputGroup}>
                                <input
                                    type={confirm ? 'text' : 'password'}
                                    {...register('confirm', {
                                        required: '必須項目です',
                                        minLength: {
                                            value: 8,
                                            message: '8文字以上で入力してください',
                                        },
                                        maxLength: {
                                            value: 50,
                                            message: '50文字以内で入力してください',
                                        },
                                        pattern: {
                                            value: /^(?=.*[A-Z])[0-9a-zA-Z]*$/,
                                            message:
                                            '半角英数字かつ少なくとも1つの大文字を含めてください',
                                        },
                                        validate: (value) =>
                                        value === getValues('password') ||
                                        'パスワードが一致しません',
                                    })}
                                />
                                <button onClick={confirmClick}>
                                    {confirm ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            {errors.confirm && 
                                <span className={styles.errorMessage}>
                                    {errors.confirm.message}
                                </span>
                            }
                        </div>
                        <button className={styles.loginBtn} type='submit'>
                            新規登録
                        </button>
                        <NextLink href='/signin' className={styles.signupLink}>
                            <button className={styles.signupBtn}>ログインはこちらから</button>
                        </NextLink>
                    </div>
                </form>
                {notification.status && (
                    <div className={`notification ${notification.status}`}>
                        {notification.message}
                    </div>
                )}
            </div>
        </div>
    )
}
