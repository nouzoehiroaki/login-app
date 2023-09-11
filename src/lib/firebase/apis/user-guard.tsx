'use client'
import { useRouter,usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { User } from '../types/user';
import { useAuth } from '../context/auth';
type Props = {
    children: ((user: User) => ReactNode) | ReactNode;
};
const UserGuard = ({ children }: Props) => {
    const user = useAuth();
    const router = useRouter();
    const pathname = usePathname()
    if (user === null && pathname !== '/signin') {
        router.push('/signin');
        return null;
    }
    if (!user) {
        return null;
    }
    if (typeof children === 'function') {
        // 関数であればユーザー情報を渡して実行
        return <>{children(user)}</>;
    } else {
        // Nodeであればそのまま表示
        return <>{children}</>;
    }
};
export default UserGuard;