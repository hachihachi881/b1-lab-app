import { functions } from "../../lib/firebase";
import { httpsCallable } from "firebase/functions";

export const callFunction = async <TReq, TRes>(
    functionName: string,
    payload?: TReq
): Promise<TRes> => {
    const callable = httpsCallable<TReq, TRes>(functions, functionName);
    const result = await callable(payload as TReq);
    return result.data;
};
