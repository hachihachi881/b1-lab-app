import { AuthContext } from "./auth";

export const requireMember = (_ctx: AuthContext): void => {
    throw new Error("Not implemented");
};

export const requireAdmin = (_ctx: AuthContext): void => {
    throw new Error("Not implemented");
};
