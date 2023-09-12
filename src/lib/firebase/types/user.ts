export type Gender = 'male' | 'female';
export type User = {
    id: string;
    username: string;
    email: string;
    photoURL: string;
    dateOfBirth: string;
    gender: Gender;
};