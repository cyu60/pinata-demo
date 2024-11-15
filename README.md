# 🌟 VoiceVault

A Next.js application for experimenting with cloud storage and text-to-speech conversion using Pinata Storage and ElevenLabs to prep for HackUTD

## Features

- 📁 Upload and store files using Pinata as S3 alternative
- 🔊 Convert text to speech using ElevenLabs
- 🔐 Secure file storage with JWT authentication
- 📱 Responsive UI with Tailwind CSS
- 🎯 Real-time file preview
- 📋 File management dashboard

## Setup

1. Clone this repository
2. Create a `.env` file based on `.env.example`
3. Fill in your environment variables:
   - Get your Pinata JWT and Gateway URL from [Pinata](https://app.pinata.cloud/)
   - Get your ElevenLabs API key from [ElevenLabs](https://elevenlabs.io/)

## Environment Variables

The following environment variables are required:

- `PINATA_JWT`: Your Pinata JWT token for IPFS storage
- `NEXT_PUBLIC_GATEWAY_URL`: Your Pinata Gateway URL
- `ELEVENLABS_API_KEY`: Your ElevenLabs API key for text-to-speech conversion

## Development

```bash
npm install
npm run dev
```

## Important Notes

- Never commit your `.env` file
- Always use `.env.example` as a template for required environment variables
- This project is intended as a learning resource for working with Pinata's SDK

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Pinata Storage
- ElevenLabs API

## Documentation References

- [Pinata File Groups Documentation](https://docs.pinata.cloud/files/file-groups) - Learn about organizing and managing files in Pinata Storage
- [ElevenLabs Streaming Guide](https://elevenlabs.io/docs/developer-guides/how-to-use-tts-with-streaming) - Guide for text-to-speech with streaming
- [Next.js Integration with Pinata](https://docs.pinata.cloud/frameworks/next-js-files) - Official guide for using Pinata with Next.js
- [Example Repository](https://github.com/cyu60/pinata-demo) - Reference implementation
