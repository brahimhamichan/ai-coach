# Vapi Call Prompts

This directory contains the AI assistant prompts for each call type. These prompts should be configured in your Vapi dashboard when setting up the assistants.

## Call Types

| File            | Purpose                                  | Frequency              |
| --------------- | ---------------------------------------- | ---------------------- |
| `onboarding.md` | First call: Build vision and commitments | Once per user          |
| `weekly.md`     | Sunday planning call                     | Weekly                 |
| `daily.md`      | Daily evening recap                      | Mon-Fri (configurable) |

## Setup Instructions

1. Go to [Vapi Dashboard](https://dashboard.vapi.ai)
2. Create a new Assistant for each call type
3. Copy the prompt content into the Assistant's system prompt
4. Configure the webhook URL: `https://your-domain.convex.site/vapi/webhook`
5. Enable call transcription and set appropriate voice settings

## Webhook Payload Format

When calls complete, Vapi sends this payload to your webhook:

```json
{
  "user_id": "uuid-or-phone-mapped",
  "call_type": "onboarding|weekly|daily",
  "call_session_id": "uuid",
  "timestamp": "ISO-8601",
  "summary_text": "...",
  "extracted": {
    "vision": {},     // For onboarding calls
    "weekly": {},     // For weekly calls  
    "daily": {}       // For daily calls
  }
}
```

## Voice Settings Recommendation

For ADHD-friendly coaching:
- **Voice**: Warm, calm, slightly slower pace
- **Interruption Handling**: Patient, allows thinking time
- **Tone**: Supportive but direct, blunt when needed
