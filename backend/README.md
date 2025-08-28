# backend

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

## Running Docker 
### Building the Image

```bash
docker build -t backend-app .
```

### Running the Container

```bash
docker run -p 3000:3000 \
  -e DB_URL="your_database_url" \
  -e OPENROUTER_KEY="your_openrouter_key" \
  -e FROM_EMAIL="your_email" \
  -e POSTMARK_SERVER_TOKEN="your_postmark_token" \
  -e RZP_WEBHOOK_SECRET="your_razorpay_webhook_secret" \
  backend-app

## For quick testing (without env vars):
  docker run -p 3000:3000 backend-app 
```

### Required Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

- `DB_URL`: PostgreSQL database connection string
- `OPENROUTER_KEY`: API key for OpenRouter AI services
- `FROM_EMAIL`: Email address for sending emails
- `POSTMARK_SERVER_TOKEN`: Postmark email service token
- `RZP_WEBHOOK_SECRET`: Razorpay webhook verification secret

This project was created using `bun init` in bun v1.2.2. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
