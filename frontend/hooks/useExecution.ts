import { BACKEND_URL } from "@/lib/utils";
import { useEffect, useState } from "react";


export interface Execution {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    type: ExecutionType;
}
  
enum ExecutionType {
    CONVERSATION = "CONVERSATION",
    ARTICLE_SUMMARIZER = "ARTICLE_SUMMARIZER"
}
  
export function useExecution() {
    const [executions, setExecutions] = useState<Execution[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createNewExecution = () => {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        const optimistic: Execution = {
            id,
            title: "New Execution",
            createdAt: now,
            updatedAt: now,
            type: ExecutionType.CONVERSATION
        };
        setExecutions((prev) => [optimistic, ...(Array.isArray(prev) ? prev : [])]);
        return id;
    }

    const fetchExecutions = async () => {
        const response = await fetch(`${BACKEND_URL}/execution`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const data = await response.json();
        setExecutions(data.executions);
    }

    const refreshExecutions = async () => {
        const response = await fetch(`${BACKEND_URL}/execution`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const data = await response.json();
        setExecutions(data.executions);
    }

    useEffect(() => {
        fetchExecutions();
    }, []);

    return { executions, loading, error, refreshExecutions, createNewExecution };
}