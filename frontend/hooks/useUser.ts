import { BACKEND_URL } from "@/lib/utils";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store";

export const useUser = () => {
    const { user: storeUser, token, setUser: setStoreUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(!storeUser);

    useEffect(() => {
        if (storeUser) {
            setIsLoading(false);
            return;
        }

        if (!token) {
            const localToken = localStorage.getItem("token");
            if (!localToken) {
                setIsLoading(false);
                return;
            }
        }

        const currentToken = token || localStorage.getItem("token");
        if (!currentToken) {
            setIsLoading(false);
            return;
        }

        fetch(`${BACKEND_URL}/auth/me`, {
            headers: {
                "Authorization": `Bearer ${currentToken}`
            }
        }).then((res) => {
            res.json().then((data) => {
                setStoreUser(data.user);
                setIsLoading(false);
            }).catch(() => {
                setIsLoading(false);
            });
        }).catch(() => {
            setIsLoading(false);
        });
    }, [storeUser, token, setStoreUser]);

    return { user: storeUser, isLoading };
}