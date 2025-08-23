import axios from "axios";

export async function sendEmail(to: string, subject: string, body: string) {
    // Check if required environment variables are set
    if (!process.env.FROM_EMAIL) {
        throw new Error("FROM_EMAIL environment variable is not set");
    }
    
    if (!process.env.POSTMARK_SERVER_TOKEN) {
        throw new Error("POSTMARK_SERVER_TOKEN environment variable is not set");
    }

    let data = JSON.stringify({
        "From": process.env.FROM_EMAIL,
        "To": to,
        "Subject": subject,
        "TextBody": body,
        "HtmlBody": body,
        "MessageStream": "outbound"
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.postmarkapp.com/email',
        headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json', 
            'X-Postmark-Server-Token': process.env.POSTMARK_SERVER_TOKEN
        },
        data : data
    };

    try {
        const response = await axios.request(config);
        console.log("Email sent successfully:", response.data);
        return response;
    } catch (error) {
        console.error("Failed to send email:", error);
        if (axios.isAxiosError(error)) {
            console.error("Response data:", error.response?.data);
            console.error("Response status:", error.response?.status);
        }
        throw error;
    }
}