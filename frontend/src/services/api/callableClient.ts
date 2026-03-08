import "../../lib/firebase";
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();

export const callFunction = async <TReq, TRes>(
    functionName: string,
    payload?: TReq
): Promise<TRes> => {
    const callable = httpsCallable<TReq, TRes>(functions, functionName);
    const result = await callable(payload as TReq);
    return result.data;
};
