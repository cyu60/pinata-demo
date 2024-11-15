# 🌟 VoiceVault IPFS

A Next.js application for experimenting with decentralized file storage and text-to-speech conversion using Pinata IPFS and ElevenLabs to prep for HackUTD

## Features

- 📁 Upload and store files on IPFS via Pinata
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
- Pinata SDK
- ElevenLabs API
