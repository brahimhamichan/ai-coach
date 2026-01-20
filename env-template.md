# Environment Variables Template

Copy this file to `.env.local` and fill in the values.

## Convex
```
# Your Convex deployment URL (get from Convex dashboard)
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

## Vapi (AI Phone Calls)
```
# Get from https://dashboard.vapi.ai/api-keys
VAPI_API_KEY=your_vapi_api_key

# Get from https://dashboard.vapi.ai/assistants
VAPI_ASSISTANT_ID_ONBOARDING=your_onboarding_assistant_id
VAPI_ASSISTANT_ID_WEEKLY=your_weekly_assistant_id
VAPI_ASSISTANT_ID_DAILY=your_daily_assistant_id

# Get from https://dashboard.vapi.ai/phone-numbers
VAPI_PHONE_NUMBER_ID=your_phone_number_id


```

## Plivo (SMS - Future Implementation)
```
# Get from https://console.plivo.com/dashboard/
PLIVO_AUTH_ID=your_plivo_auth_id
PLIVO_AUTH_TOKEN=your_plivo_auth_token
PLIVO_SENDER_NUMBER=+1234567890
```



---

## Setup Instructions

### 1. Convex Setup
```bash
npx convex dev
```
This will prompt you to log in and create a project. The deployment URL will be automatically added to `.env.local`.

### 2. Vapi Setup
1. Create account at [vapi.ai](https://vapi.ai)
2. Go to API Keys in dashboard
3. Create a new API key
4. Set your webhook URL in assistant settings: `https://your-domain.com/api/vapi/webhook`

### 3. Plivo Setup (Future)
1. Create account at [plivo.com](https://www.plivo.com)
2. Get Auth ID and Token from console
3. Purchase a phone number for sending SMS
