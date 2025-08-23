export function otpEmailHTML(otp: string, email: string, validitySeconds = 90) {
  return `
  <html>
    <body style="font-family: Arial, sans-serif; background:#f9fafb; padding:20px;">
      <div style="max-width:500px; margin:auto; background:white; padding:20px; border-radius:8px;">
        <h2 style="color:#111827;">Your 1ai login code</h2>
        <p>Hello,</p>
        <p>Use the code below to sign in as <b>${escapeHTML(email)}</b>:</p>
        <p style="font-size:24px; font-weight:bold; letter-spacing:4px; background:#f3f4f6; padding:10px 20px; border-radius:6px; display:inline-block;">${otp}</p>
        <p style="color:#6b7280; font-size:14px;">This code is valid for ~${validitySeconds} seconds.</p>
        <p style="color:#9ca3af; font-size:12px;">If you didn’t request this, you can safely ignore this email.</p>
      </div>
    </body>
  </html>
  `;
}

function escapeHTML(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]!));
}
