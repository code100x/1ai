# 1AI Project Setup Guide for UI Development

## 🚀 Quick Start for UI Development

### Essential API Keys (Only 2 Required):

#### 1. **OpenRouter API Key** ⭐ REQUIRED

- **Purpose**: Powers the AI chat functionality
- **Get it**: https://openrouter.ai/
- **Cost**: Free tier available
- **Steps**:
  1. Sign up at OpenRouter
  2. Go to API Keys section
  3. Create a new API key
  4. Copy the key

#### 2. **Database URL** ⭐ REQUIRED

- **Purpose**: Stores user data, conversations, etc.
- **Options**:
  - **Supabase** (Recommended - Free): https://supabase.com/
  - **Neon** (Free): https://neon.tech/
  - **Railway** (Free): https://railway.app/
  - **Local PostgreSQL** (if installed)

### Optional API Keys (For Full Features):

- **Razorpay**: Only needed for payment testing
- **Postmark**: Only needed for email functionality
- **JWT Secret**: Can use any random string for development

## 📝 Environment Setup

### Backend (.env):

```bash
# ESSENTIAL - Replace these values
DATABASE_URL="your-postgresql-connection-string"
OPENROUTER_KEY="your-openrouter-api-key"

# OPTIONAL - Can use default values for development
JWT_SECRET="any-random-string-for-development"
FRONTEND_URL="http://localhost:3002"
NODE_ENV="development"

# OPTIONAL - Only if testing payments/emails
RZP_KEY="your-razorpay-key"
RZP_SECRET="your-razorpay-secret"
RZP_ENVIRONMENT="sandbox"
RZP_WEBHOOK_SECRET="your-razorpay-webhook-secret"
POSTMARK_SERVER_TOKEN="your-postmark-token"
FROM_EMAIL="noreply@yourdomain.com"
```

### Frontend (.env):

```bash
# ESSENTIAL
NEXT_PUBLIC_BACKEND_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3002"

# OPTIONAL - Only if testing payments
NEXT_PUBLIC_RZP_KEY="your-razorpay-public-key"
```

## 🛠️ Setup Steps:

1. **Get OpenRouter API Key** (5 minutes)
2. **Set up Database** (10 minutes)
3. **Update .env files** (2 minutes)
4. **Run migrations** (1 minute)
5. **Start the app** (2 minutes)

## 🎯 For UI Development Focus:

You only need:

- ✅ OpenRouter API Key
- ✅ Database URL
- ✅ Basic .env setup

Everything else is optional and won't block your UI development!

## 🚨 Common Issues:

- **"DATABASE_URL not found"**: Make sure your database is running and URL is correct
- **"OpenRouter API error"**: Check your API key and ensure you have credits
- **"CORS error"**: Make sure backend is running on port 3000 and frontend on 3002

## 💡 Tips:

- Use Supabase for database (free, easy setup)
- OpenRouter gives free credits to start
- For UI work, you can ignore payment/email features initially
