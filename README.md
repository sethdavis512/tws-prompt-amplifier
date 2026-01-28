# Prompt Amplifier

A tray-based Electron app that takes your simple prompts and transforms them into comprehensive, well-structured prompts using OpenAI's GPT-4.

## Features

- **System Tray Integration**: Lives in your system tray for quick access
- **Prompt Enhancement**: Uses GPT-5.2 to improve your prompts with better context, structure, and clarity
- **One-Click Copy**: Easily copy the amplified prompt to your clipboard
- **Keyboard Shortcuts**:
  - `Ctrl/Cmd + Enter` - Amplify prompt
  - `Escape` - Hide window
- **Auto-hide**: Window hides when you click elsewhere

## Setup

### Prerequisites

- Node.js 18+ installed
- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the app:

   ```bash
   npm start
   ```

### First-Time Setup

1. Click the tray icon to open the popup
2. Click the ⚙️ settings icon
3. Enter your OpenAI API key
4. Start amplifying your prompts!

## Usage

1. Click the tray icon to open the popup
2. Type your simple prompt in the input field
3. Click "🚀 Amplify Prompt" or press `Ctrl/Cmd + Enter`
4. Wait for the AI to generate an improved version
5. Click "📋 Copy" to copy the result to your clipboard

## Building for Distribution

To create a distributable package:

```bash
npm run build
```

This will create installers for your platform in the `dist` folder.

## Customization

### Changing the Icon

Replace `icon.png` with your own 32x32 or larger PNG file. The app will automatically resize it for the tray.

### Modifying the Prompt Enhancement

Edit the system prompt in `index.html` to customize how prompts are improved.

## Tech Stack

- Electron
- OpenAI GPT-5.2 API
- Vanilla JavaScript/HTML/CSS

## License

MIT
