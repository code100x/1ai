import axios from "axios";

export function sendEmail(to: string, subject: string, body: string, htmlBody?: string) {
    let data = JSON.stringify({
        "From": process.env.FROM_EMAIL!,
        "To": to,
        "Subject": subject,
        "TextBody": body,
        "HtmlBody": htmlBody || body,
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

    return axios.request(config)
}

export function createOTPEmailHTML(otp: string, email: string, expires : number): string {
    return `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>1Ai Chat - Verification Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);">
    <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        color: #333333;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        margin-top: 40px;
        margin-bottom: 40px;
    ">
        <!-- Header with Logo -->
        <div style="
            text-align: center;
            margin-bottom: 40px;
            padding: 30px 20px;
            background: linear-gradient(135deg, #FFDD00 0%, #FFC107 100%);
            border-radius: 12px 12px 0 0;
            margin: -20px -20px 40px -20px;
        ">
            <!-- SVG Logo -->
            <div style="margin-bottom: 20px;">
                <svg width="60" height="60" viewBox="0 0 161 99" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_23_49)">
                        <g filter="url(#filter0_iii_23_49)">
                            <path d="M1.08594 49.944C1.08594 23.4342 22.5763 1.94391 49.0859 1.94391H112.086C138.596 1.94391 160.086 23.4342 160.086 49.944V97.944H49.0859C22.5763 97.944 1.08594 76.4537 1.08594 49.944Z" fill="#333333"/>
                        </g>
                        <path d="M112.086 19.944H49.0858C32.5174 19.944 19.0859 33.3754 19.0859 49.944C19.0859 66.5124 32.5174 79.944 49.0858 79.944H112.086C128.654 79.944 142.086 66.5124 142.086 49.944C142.086 33.3754 128.654 19.944 112.086 19.944Z" fill="white"/>
                        <path d="M49.0859 64.944C57.3703 64.944 64.0859 58.228 64.0859 49.944C64.0859 41.6596 57.3703 34.944 49.0859 34.944C40.8019 34.944 34.0859 41.6596 34.0859 49.944C34.0859 58.228 40.8019 64.944 49.0859 64.944Z" fill="black"/>
                        <path d="M43.0859 46.944C44.7429 46.944 46.0859 45.6007 46.0859 43.944C46.0859 42.287 44.7429 40.944 43.0859 40.944C41.4292 40.944 40.0859 42.287 40.0859 43.944C40.0859 45.6007 41.4292 46.944 43.0859 46.944Z" fill="white"/>
                        <path d="M115.086 64.944C123.37 64.944 130.086 58.228 130.086 49.944C130.086 41.6596 123.37 34.944 115.086 34.944C106.802 34.944 100.086 41.6596 100.086 49.944C100.086 58.228 106.802 64.944 115.086 64.944Z" fill="black"/>
                        <path d="M109.086 46.944C110.743 46.944 112.086 45.6007 112.086 43.944C112.086 42.287 110.743 40.944 109.086 40.944C107.429 40.944 106.086 42.287 106.086 43.944C106.086 45.6007 107.429 46.944 109.086 46.944Z" fill="#FAFCFF"/>
                    </g>
                    <defs>
                        <filter id="filter0_iii_23_49" x="1.08594" y="1.94391" width="163.8" height="100.8" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset dx="4.8"/>
                            <feGaussianBlur stdDeviation="9.6"/>
                            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"/>
                            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_23_49"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset/>
                            <feGaussianBlur stdDeviation="14.4"/>
                            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                            <feBlend mode="normal" in2="effect1_innerShadow_23_49" result="effect2_innerShadow_23_49"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset dy="4.8"/>
                            <feGaussianBlur stdDeviation="9.6"/>
                            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"/>
                            <feBlend mode="normal" in2="effect2_innerShadow_23_49" result="effect3_innerShadow_23_49"/>
                        </filter>
                        <clipPath id="clip0_23_49">
                            <rect width="160.8" height="98.4" fill="white" transform="matrix(-1 0 0 1 160.8 0)"/>
                        </clipPath>
                    </defs>
                </svg>
            </div>
            
            <h1 style="
                color: #333333;
                font-size: 28px;
                margin: 0;
                font-weight: bold;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            ">
                1AI Chat
            </h1>
            
            <p style="
                color: #555555;
                font-size: 16px;
                margin: 8px 0 0 0;
                opacity: 0.8;
            ">
                Verification Code
            </p>
        </div>
        
        <!-- Main Content -->
        <div style="margin-bottom: 40px; padding: 0 10px;">
            <div style="
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                border: 1px solid #f59e0b;
                border-radius: 12px;
                padding: 25px;
                text-align: center;
                margin-bottom: 30px;
            ">
                <div style="
                    display: inline-block;
                    background-color: #FFDD00;
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    line-height: 60px;
                    margin-bottom: 20px;
                    box-shadow: 0 4px 12px rgba(255, 221, 0, 0.3);
                ">
                    🔐
                </div>
                
                <h2 style="
                    color: #92400e;
                    font-size: 20px;
                    margin: 0 0 15px 0;
                    font-weight: bold;
                ">
                    Secure Access Code
                </h2>
                
                <p style="
                    color: #92400e;
                    font-size: 14px;
                    margin: 0;
                    opacity: 0.8;
                ">
                    Use this code to verify your 1Ai Chat account
                </p>
            </div>
            
            <p style="
                font-size: 18px;
                line-height: 1.6;
                margin: 0 0 25px 0;
                color: #374151;
            ">
                Hi <strong>${email}</strong>,
            </p>
            
            <p style="
                font-size: 16px;
                line-height: 1.6;
                margin: 0 0 30px 0;
                color: #6b7280;
            ">
                Welcome to 1Ai Chat! Please use the following verification code to complete your account setup and start chatting:
            </p>
            
            <!-- OTP Code Box -->
            <div style="
                background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
                border: 3px solid #FFDD00;
                border-radius: 16px;
                padding: 35px 25px;
                text-align: center;
                margin: 30px 0;
                position: relative;
                box-shadow: 0 8px 25px rgba(255, 221, 0, 0.15);
            ">
                <div style="
                    position: absolute;
                    top: -15px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: #FFDD00;
                    color: #92400e;
                    padding: 8px 20px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                ">
                    Your Code
                </div>
                
                <div style="
                    font-size: 42px;
                    font-weight: bold;
                    color: #92400e;
                    letter-spacing: 12px;
                    font-family: 'Courier New', monospace;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    margin: 15px 0;
                ">
                    ${otp}
                </div>
                
                <div style="
                    background-color: rgba(255, 221, 0, 0.2);
                    border-radius: 8px;
                    padding: 10px;
                    margin-top: 20px;
                ">
                    <p style="
                        font-size: 13px;
                        color: #92400e;
                        margin: 0;
                        font-weight: 500;
                    ">
                        ⏱️ Expires in <strong>${expires} minutes</strong>
                    </p>
                </div>
            </div>
            
            <!-- Security Notice -->
            <div style="
                background-color: #f3f4f6;
                border-left: 4px solid #FFDD00;
                border-radius: 8px;
                padding: 20px;
                margin: 30px 0;
            ">
                <h3 style="
                    color: #374151;
                    font-size: 16px;
                    margin: 0 0 10px 0;
                    font-weight: bold;
                ">
                    🛡️ Security Notice
                </h3>
                
                <p style="
                    font-size: 14px;
                    line-height: 1.5;
                    margin: 0;
                    color: #6b7280;
                ">
                    If you didn't request this verification code, please ignore this email or contact our support team immediately. Never share your verification code with anyone.
                </p>
            </div>
            
          
        </div>
        
        <!-- Footer -->
        <div style="
            border-top: 2px solid #f3f4f6;
            padding-top: 25px;
            text-align: center;
            margin-top: 40px;
        ">
            <div style="margin-bottom: 20px;">
                <svg width="30" height="30" viewBox="0 0 161 99" fill="none" xmlns="http://www.w3.org/2000/svg" style="opacity: 0.6;">
                    <g clip-path="url(#clip0_23_49_footer)">
                        <g filter="url(#filter0_iii_23_49_footer)">
                            <path d="M1.08594 49.944C1.08594 23.4342 22.5763 1.94391 49.0859 1.94391H112.086C138.596 1.94391 160.086 23.4342 160.086 49.944V97.944H49.0859C22.5763 97.944 1.08594 76.4537 1.08594 49.944Z" fill="#FFDD00"/>
                        </g>
                        <path d="M112.086 19.944H49.0858C32.5174 19.944 19.0859 33.3754 19.0859 49.944C19.0859 66.5124 32.5174 79.944 49.0858 79.944H112.086C128.654 79.944 142.086 66.5124 142.086 49.944C142.086 33.3754 128.654 19.944 112.086 19.944Z" fill="white"/>
                        <path d="M49.0859 64.944C57.3703 64.944 64.0859 58.228 64.0859 49.944C64.0859 41.6596 57.3703 34.944 49.0859 34.944C40.8019 34.944 34.0859 41.6596 34.0859 49.944C34.0859 58.228 40.8019 64.944 49.0859 64.944Z" fill="black"/>
                        <path d="M43.0859 46.944C44.7429 46.944 46.0859 45.6007 46.0859 43.944C46.0859 42.287 44.7429 40.944 43.0859 40.944C41.4292 40.944 40.0859 42.287 40.0859 43.944C40.0859 45.6007 41.4292 46.944 43.0859 46.944Z" fill="white"/>
                        <path d="M115.086 64.944C123.37 64.944 130.086 58.228 130.086 49.944C130.086 41.6596 123.37 34.944 115.086 34.944C106.802 34.944 100.086 41.6596 100.086 49.944C100.086 58.228 106.802 64.944 115.086 64.944Z" fill="black"/>
                        <path d="M109.086 46.944C110.743 46.944 112.086 45.6007 112.086 43.944C112.086 42.287 110.743 40.944 109.086 40.944C107.429 40.944 106.086 42.287 106.086 43.944C106.086 45.6007 107.429 46.944 109.086 46.944Z" fill="#FAFCFF"/>
                    </g>
                    <defs>
                        <filter id="filter0_iii_23_49_footer" x="1.08594" y="1.94391" width="163.8" height="100.8" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset dx="4.8"/>
                            <feGaussianBlur stdDeviation="9.6"/>
                            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"/>
                            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_23_49"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset/>
                            <feGaussianBlur stdDeviation="14.4"/>
                            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                            <feBlend mode="normal" in2="effect2_innerShadow_23_49" result="effect2_innerShadow_23_49"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset dy="4.8"/>
                            <feGaussianBlur stdDeviation="9.6"/>
                            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"/>
                            <feBlend mode="normal" in2="effect2_innerShadow_23_49" result="effect3_innerShadow_23_49"/>
                        </filter>
                        <clipPath id="clip0_23_49_footer">
                            <rect width="160.8" height="98.4" fill="white" transform="matrix(-1 0 0 1 160.8 0)"/>
                        </clipPath>
                    </defs>
                </svg>
            </div>
            
            <p style="
                font-size: 12px;
                color: #9ca3af;
                margin: 0 0 10px 0;
                line-height: 1.4;
            ">
                This is an automated message from 1Ai Chat. Please do not reply to this email.
            </p>
            
            <!-- <p style="
                font-size: 12px;
                color: #9ca3af;
                margin: 0;
            ">
                © 2025 1Ai Chat. All rights reserved. | 
                <a href="#" style="color: #FFDD00; text-decoration: none;">Privacy Policy</a> | 
                <a href="#" style="color: #FFDD00; text-decoration: none;">Support</a>
            </p> -->
        </div>
    </div>
</body>
</html>
    `;
}