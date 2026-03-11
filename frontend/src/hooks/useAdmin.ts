/**
 * useAdmin Hook
 * 
 * 管理者権限を管理するカスタムフック
 * 現在のユーザーが管理者かどうかを判定し、状態を管理
 * ログイン状態変更時に自動で管理者権限をチェック
 * 
 * @returns {UseAdminReturn} 管理者状態、ローディング状態、手動チェック関数
 */
import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface UseAdminReturn {
    isAdmin: boolean;
    loading: boolean;
    checkAdmin: (uid: string) => Promise<boolean>;
    refreshAdminStatus: () => Promise<void>;
}

export const useAdmin = (): UseAdminReturn => {
    const { user, loading: authLoading } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    // 管理者権限チェック関数（Firestoreから直接読み取り）
    const checkAdmin = async (uid: string): Promise<boolean> => {
        try {
            const memberRef = doc(db, "members", uid);
            const memberSnap = await getDoc(memberRef);
            return memberSnap.exists() && memberSnap.data()?.isAdmin === true;
        } catch (error) {
            console.error("管理者チェックエラー:", error);
            return false;
        }
    };

    // 現在のユーザーの管理者権限を更新
    const refreshAdminStatus = async (): Promise<void> => {
        if (!user?.uid) {
            setIsAdmin(false);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const adminStatus = await checkAdmin(user.uid);
            setIsAdmin(adminStatus);
        } catch (error) {
            console.error("管理者ステータス更新エラー:", error);
            setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    };

    // ユーザー状態変更時に管理者権限をチェック
    useEffect(() => {
        if (authLoading) {
            setLoading(true);
            return;
        }

        if (!user) {
            setIsAdmin(false);
            setLoading(false);
            return;
        }

        refreshAdminStatus();
    }, [user, authLoading]);

    return {
        isAdmin,
        loading,
        checkAdmin,
        refreshAdminStatus
    };
};