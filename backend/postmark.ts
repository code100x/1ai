import axios from "axios";

type EmailArgs = {
    to: string;
    subject: string;
    text: string;
    html?: string;
};

export function sendEmail(arg1: string | EmailArgs, subject?: string, body?: string) {
    let to: string;
    let textBody: string;
    let htmlBody: string | undefined;

    if (typeof arg1 === "string") {
        // Old style : sendEmail(to, subject, body)
        to = arg1;
        textBody = body!;
        htmlBody = body;
    } else {
        // New style : sendEmail({ to, subject, text, html })
        to = arg1.to;
        subject = arg1.subject;
        textBody = arg1.text;
        htmlBody = arg1.html ?? arg1.text; // fallback to text if no html
    }

    let data = JSON.stringify({
        "From": process.env.FROM_EMAIL!,
        "To": to,
        "Subject": subject!,
        "TextBody": textBody,
        "HtmlBody": htmlBody,
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
        data: data
    };

    return axios.request(config);
}
