## Fixing OTP Login Locally

many people are stuck at login with OTP locally on their machine, (saw on chat)

### 1. Generate a Database URL

- Create a new **NeonDB** project.
- Copy the database connection URL.

### 2. Create `.env` in Backend

Inside your backend project, create a `.env` file and paste the following:

```env
POSTMARK_SERVER_TOKEN=POSTMARK_API_TEST
FROM_EMAIL=anything@example.com
JWT_SECRET="UjAS7CTtHX7UJk4NhUp1vJ5Xg/WBOMa0UQPysFxeD7k="
```

### 3. Generate Your Own JWT Secret

generate a new jwt secret with:

openssl rand -base64 32

check terminal, otp will most probally come there not on gmail
