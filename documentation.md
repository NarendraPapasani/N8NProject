# Sentiment Analysis Web Application

## 📋 Project Overview

This is a full-stack sentiment analysis application that combines a **React.js frontend** with an **n8n workflow backend** powered by **Google Gemini AI**. The application analyzes user-provided text to determine its emotional tone (Positive, Negative, or Neutral) and generates a concise summary.

---

## 🎯 What Does This Project Do?

This application allows users to:

1. **Input text** (sentences or paragraphs) through a user-friendly web interface
2. **Receive AI-powered analysis** including:
   - **Sentiment Classification**: Categorizes the text as Positive, Negative, or Neutral
   - **Text Summary**: Provides a concise one-sentence summary of the input

The results are displayed in a beautiful, color-coded interface with:

- 🟢 **Green** for Positive sentiment
- 🔴 **Red** for Negative sentiment
- 🔵 **Blue** for Neutral sentiment

---

## 🏗️ Architecture

### Frontend (React.js + Vite)

- **Framework**: React 19.1.1 with Vite 7.1.7
- **Styling**: Tailwind CSS 3.x with shadcn/ui components
- **UI Components**:
  - Custom textarea for text input
  - Loading skeletons during processing
  - Color-coded result cards
  - Toast notifications for errors and success messages
- **Icons**: Lucide React icons for visual feedback

### Backend (n8n Workflow)

- **Workflow Engine**: n8n (automation platform)
- **AI Model**: Google Gemini 2.5 Flash
- **API**: Webhook-based REST API with CORS enabled

---

## 🔄 How the n8n Workflow Works

The n8n workflow processes text through the following steps:

### 1. **Webhook Reception** (`Webhook` node)

- **Endpoint**: `POST http://localhost:5678/webhook/d7d09f23-1436-4792-9b8b-a6ea389ffb7e`
- **Accepts**: JSON payload with `{ "text": "user input" }`
- **CORS**: Enabled with `Access-Control-Allow-Origin: *`

### 2. **Parallel Processing**

The workflow splits into two parallel branches:

#### Branch A: Sentiment Analysis

- **Node**: `Message a model`
- **Prompt**: "Analyze the sentiment of the following text. Respond with only one word: Positive, Negative, or Neutral."
- **Input**: User's text from webhook
- **Output**: Single word (Positive/Negative/Neutral)

#### Branch B: Text Summarization

- **Node**: `Message a model1`
- **Prompt**: "Summarize the following text in one short sentence."
- **Input**: User's text from webhook
- **Output**: One-sentence summary

### 3. **Data Preparation for Merge**

- **Node**: `Edit Fields1` (for sentiment)

  - Adds a `mergeKey: "merge"` field
  - Preserves sentiment analysis result

- **Node**: `Edit Fields2` (for summary)
  - Adds a `mergeKey: "merge"` field
  - Preserves summary result

### 4. **Merge Results** (`Merge` node)

- Combines both branches using the `mergeKey` field
- Creates a unified data object containing both sentiment and summary

### 5. **Format Response** (`Edit Fields` node)

- Extracts sentiment: `$('Message a model').item.json.content.parts[0].text`
- Extracts summary: `$('Edit Fields2').item.json.content.parts[0].text`
- Creates final JSON structure:

```json
{
  "sentimentResult": "Positive",
  "summaryResult": "The text expresses happiness about the product."
}
```

### 6. **Send Response** (`Respond to Webhook` node)

- Returns the formatted JSON to the React frontend
- Completes the HTTP request-response cycle

---

## 🎨 Frontend Features

### Input Section

- Large, responsive textarea for text input
- Real-time validation with inline error messages
- Red border highlight for validation errors
- Auto-clear errors when user starts typing

### Loading State

- Animated spinner on submit button
- Skeleton loaders showing processing state
- Disabled button during API call

### Results Display

Dynamic, color-coded cards based on sentiment:

**Positive Results** (Green theme):

- Green gradient background
- Smile icon 😊
- Green borders and badges

**Negative Results** (Red theme):

- Red gradient background
- Frown icon 😞
- Red borders and badges

**Neutral Results** (Blue theme):

- Blue gradient background
- Neutral face icon 😐
- Blue borders and badges

**Summary Section**:

- Purple/pink gradient background
- File icon
- White semi-transparent text container

### Error Handling

- **Input Validation**: Inline error message below textarea
- **API Errors**: Color-coded toast notifications
  - ✅ Success: Green toast
  - ❌ Error: Red toast with error details

---

## 📦 Dependencies

### Frontend

```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "tailwindcss": "^3.4.0",
  "class-variance-authority": "latest",
  "clsx": "latest",
  "tailwind-merge": "latest",
  "lucide-react": "latest",
  "@radix-ui/react-slot": "latest",
  "@radix-ui/react-toast": "latest",
  "tailwindcss-animate": "latest"
}
```

### Backend (n8n)

- n8n workflow platform
- Google Gemini API integration
- n8n-nodes-base (Webhook, Set, Merge, Respond nodes)
- @n8n/n8n-nodes-langchain (Google Gemini nodes)

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ installed
- n8n installed and running
- Google Gemini API key

### Frontend Setup

```bash
# Navigate to project directory
cd /home/sai/Work\ Space/reachinbox/n8nProject

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Backend Setup (n8n)

1. Install n8n:

```bash
npm install -g n8n
```

2. Start n8n:

```bash
n8n start
```

3. Import the workflow:
   - Open n8n at `http://localhost:5678`
   - Create new workflow
   - Import the provided JSON workflow
   - Add Google Gemini API credentials
   - Activate the workflow

---

## 🔌 API Integration

### Request Format

```javascript
POST http://localhost:5678/webhook/d7d09f23-1436-4792-9b8b-a6ea389ffb7e
Content-Type: application/json

{
  "text": "Your text to analyze goes here"
}
```

### Response Format

```json
{
  "sentimentResult": "Positive",
  "summaryResult": "Brief one-sentence summary of the text."
}
```

---

## 🎯 Use Cases

- **Customer Feedback Analysis**: Quickly understand customer sentiment
- **Social Media Monitoring**: Analyze posts and comments
- **Content Review**: Evaluate tone of written content
- **Email Classification**: Sort emails by emotional tone
- **Survey Analysis**: Process open-ended survey responses

---

## 🛠️ Technology Stack

| Layer              | Technology              |
| ------------------ | ----------------------- |
| Frontend Framework | React.js 19             |
| Build Tool         | Vite 7                  |
| Styling            | Tailwind CSS 3          |
| UI Components      | shadcn/ui               |
| Icons              | Lucide React            |
| Backend            | n8n Workflow            |
| AI Model           | Google Gemini 2.5 Flash |
| API                | REST (Webhook)          |

---

## 📊 Workflow Visualization

```
User Input (React)
    ↓
Webhook (n8n)
    ↓
    ├─→ Sentiment Analysis (Gemini) → Edit Fields1 ─┐
    │                                                  ↓
    │                                               Merge
    │                                                  ↓
    └─→ Text Summary (Gemini) → Edit Fields2 ────────┘
                                                       ↓
                                                 Format Response
                                                       ↓
                                                 Return to React
                                                       ↓
                                              Display Results (UI)
```

---

## 🎨 UI/UX Highlights

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode Ready**: CSS variables support theme switching
- **Smooth Animations**: Hover effects, loading states, toast animations
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
- **Error Prevention**: Input validation before API calls
- **User Feedback**: Clear loading states and error messages

---

## 🔐 Security Considerations

- CORS enabled for local development (`Access-Control-Allow-Origin: *`)
- For production: Configure specific allowed origins
- API key stored securely in n8n credentials
- Input sanitization recommended for production use

---

## 📝 Future Enhancements

- [ ] Add language detection
- [ ] Support multiple languages
- [ ] Historical analysis tracking
- [ ] Batch text processing
- [ ] Export results to CSV/PDF
- [ ] Confidence score for sentiment
- [ ] Emotion detection (joy, anger, sadness, etc.)
- [ ] Dark mode toggle
- [ ] User authentication

---

## 👨‍💻 Development

### Project Structure

```
n8nProject/
├── src/
│   ├── components/
│   │   ├── SentimentPage.jsx       # Main page component
│   │   └── ui/                      # shadcn/ui components
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── textarea.jsx
│   │       ├── skeleton.jsx
│   │       ├── toast.jsx
│   │       └── toaster.jsx
│   ├── hooks/
│   │   └── use-toast.js            # Toast hook
│   ├── lib/
│   │   └── utils.js                # Utility functions
│   ├── App.jsx                     # Root component
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── documentation.md                # This file
```

---

## 📄 License

This project is for educational and demonstration purposes.

---

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

---

**Built with ❤️ using React, Tailwind CSS, n8n, and Google Gemini AI**
