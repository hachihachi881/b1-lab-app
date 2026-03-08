export type AuthContext = {
    uid: string;
    email: string;
    isAdmin: boolean;
};

export const getAuthContext = async (): Promise<AuthContext> => {
    throw new Error("Not implemented");
};
