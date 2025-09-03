"use client"
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3000";

export default function YoutubeVideoSummarizer(){
    const [url, setUrl] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [response, setResponse] = React.useState("");
    const [error, setError] = React.useState<string | null>(null);

    const handleClick = async()=>{
        if (!url.trim()) return;
        setIsLoading(true);
        setResponse("");
        setError(null);

        try{
            const token = localStorage.getItem("token");
            if(!token){
                setError("Authentication token not found. Please login again.");
                setIsLoading(false);
                return;
            }

            const res = await fetch(`${BACKEND_URL}/apps/youtube-summarizer`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ url })
            });

            if(!res.body){
                setError("No response body received");
                setIsLoading(false);
                return;
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while(true){
                const {done, value} = await reader.read();
                if(done) break;
                const chunk = decoder.decode(value);
                buffer += chunk;

                const lines = buffer.split("\n");
                buffer = lines.pop() ?? "";
                for(const line of lines){
                    if(line.startsWith("data: ")){
                        const data = line.slice(6);
                        if(data && data !== "[DONE]"){
                            setResponse(prev => prev + data);
                        }
                    }
                }
            }
        }catch(e){
            setError("Failed to summarize the video");
        }finally{
            setIsLoading(false);
        }
    }

    return(
        <div className="flex flex-col items-center justify-center">
            <div className="mt-24 mb-5 flex items-center flex-col gap-2">
            <h1 className="text-xl font-bold">Youtube Video Summarizer</h1>
            <p className="text-muted-foreground">
                Summarize long and boring youtube videos into a small engaging summary
            </p>
            </div>
            <div className="px-10 w-full flex gap-2 items-center">
                <Input value={url} onChange={(e)=>setUrl(e.target.value)} type="text" placeholder="Enter Youtube Video link"/>
                <Button onClick={handleClick} disabled={isLoading}>
                    <Send/>
                </Button>
            </div>
            <div className="px-10 w-full mt-6">
                {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                )}
                {response && (
                    <div className="whitespace-pre-wrap text-md ">{response}</div>
                )}
                {isLoading && !response && (
                    <div className="text-sm text-muted-foreground">Processing...</div>
                )}
            </div>
        </div>
    )
}