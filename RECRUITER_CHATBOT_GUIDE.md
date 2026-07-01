# Recruiter Job Description Chatbot Assistant

## Overview

The **Job Description Assistant** is an AI-powered chatbot that helps recruiters quickly generate and refine professional job descriptions using the Groq LLM API. It's integrated into the recruiter's "Post Job" form on the GreatHire platform.

## Features

✨ **Generate JD from Scratch**: Automatically create a professional job description based on basic job details (title, skills, salary, etc.)

✏️ **Refine Existing JD**: Improve your job description with specific refinement goals (e.g., "make it more concise", "emphasize remote benefits")

🎯 **Smart Form Integration**: The chatbot reads current form values and suggests improvements tailored to your specific job posting

⚡ **One-Click Apply**: Apply generated JDs directly to your form with a single click

## Architecture

### Components

1. **Frontend Chat Widget** (`frontend/src/components/recruiter/ChatAssistant.jsx`)
   - Modal-based UI with conversation history
   - Real-time streaming of generated JD text
   - Form value preview and one-click application
   - Dark mode support
   - Responsive design

2. **Backend Service** (`main.py`)
   - `/generate-jd` endpoint: Generates professional JD using Groq API
   - `/refine-jd` endpoint: Refines existing JD based on user goals
   - Uses `llama-3.3-70b-versatile` model for high-quality outputs

3. **Integration** (`frontend/src/pages/recruiter/postJob/PostJob.jsx`)
   - Chat button in the Job Details section
   - Form state passed to chatbot for context-aware suggestions
   - Callback handler to update form with generated content

## Setup & Installation

### Prerequisites

- Node.js 16+ (frontend)
- Python 3.8+ (backend)
- Groq API key

### Backend Setup

1. Install dependencies:
```bash
cd GreatHire
pip install -r requirements.txt
```

2. Create `.env` file and add:
```env
GROQ_API_KEY=your_groq_api_key_here
```

3. Run the JD service:
```bash
python main.py
```

The service will start on `http://127.0.0.1:8000`

### Frontend Setup

1. Install dependencies:
```bash
cd GreatHire/frontend
npm install
```

2. Ensure the backend is running before testing

3. Start the development server:
```bash
npm run dev
```

## Usage

### User Flow

1. **Navigate to Post Job**: Go to `/recruiter/dashboard/post-job`

2. **Fill Basic Job Details**: Enter title, skills, experience level, work mode, salary range

3. **Click "AI Assistant" Button**: Located next to the "Job Details" label on Step 1

4. **Choose Action**:
   - Click **Generate JD** to create a new JD from scratch
   - Click **Refine JD** to improve an existing JD

5. **Generate Mode**:
   - Bot generates a professional JD based on your form inputs
   - Review the generated content in the chat
   - Click "Apply" to add it to your form

6. **Refine Mode**:
   - Enter the improvement goal (e.g., "make it more formal")
   - Bot refines your existing JD accordingly
   - Click "Apply" to update your form

## API Endpoints

### Generate JD

**POST** `/generate-jd`

Request body:
```json
{
  "title": "Senior Frontend Developer",
  "department": "Engineering",
  "skills": "React, TypeScript, Node.js",
  "seniority": "Senior",
  "work_mode": "Hybrid",
  "additional_context": "Salary: ₹15-20 LPA"
}
```

Response:
```json
{
  "jd": "# Senior Frontend Developer\n\n## About the Role\n...\n"
}
```

### Refine JD

**POST** `/refine-jd`

Request body:
```json
{
  "current_jd": "Your current job description...",
  "goal": "Make it more concise and technical"
}
```

Response:
```json
{
  "refined_jd": "Refined job description..."
}
```

## Technical Details

### Chat Component Props

```jsx
<ChatAssistant
  isOpen={boolean}           // Controls modal visibility
  onClose={function}         // Called when modal closes
  onApplyJD={function}       // Called with JD text when user applies
  formValues={{
    title: string,
    department: string,
    skills: string[],
    experience: string,
    workPlaceFlexibility: string,
    salary: string,
    details: string
  }}
/>
```

### State Management

The chatbot maintains:
- `messages`: Array of chat messages (user/bot)
- `input`: Current user input
- `loading`: Loading state during API calls
- `mode`: Current mode (null, generate, refine, refine-prompt, generated, refined)
- `refinementGoal`: User's refinement goal

## Error Handling

The chatbot handles:
- Missing form fields (validates before API calls)
- Network errors (displays user-friendly messages)
- API timeouts (suggests retry or manual entry)
- Invalid refinement goals (prompts for clarification)

## Performance Considerations

- JD generation takes 5-15 seconds (Groq API latency)
- Chat history is stored in React state (cleared on modal close)
- No backend persistence of chat history
- Form values are passed as props (reactive updates)

## Security

- CORS enabled on backend (configured for frontend domain)
- No sensitive data stored in chat state
- API key secured in environment variables
- DOMPurify sanitization for generated HTML content

## Testing Checklist

### Manual Testing

- [ ] Open Post Job form
- [ ] Click AI Assistant button
- [ ] Generate JD with various job types
- [ ] Refine JD with multiple improvement goals
- [ ] Apply generated JD to form
- [ ] Verify form updates correctly
- [ ] Test dark mode support
- [ ] Test responsive design on mobile
- [ ] Test with incomplete form values
- [ ] Test backend error handling

### E2E Testing

```bash
# Start backend
python main.py

# Start frontend
npm run dev

# Manual test flow:
# 1. Fill job title and skills
# 2. Click AI Assistant
# 3. Click "Generate JD"
# 4. Review generated content
# 5. Click "Apply"
# 6. Verify form updates
```

## Troubleshooting

### Chatbot not appearing?
- Ensure `ChatAssistant` component is imported in `PostJob.jsx`
- Check browser console for import errors
- Verify component path is correct

### Backend connection errors?
- Confirm backend is running on `http://127.0.0.1:8000`
- Check GROQ_API_KEY is set in `.env`
- Verify CORS settings allow frontend domain

### Generated JD not applying?
- Check form values are being passed correctly
- Verify `onApplyJD` callback is defined
- Check browser console for errors
- Ensure editorRef is properly mounted

### Slow API responses?
- Check Groq API quota/rate limits
- Verify network connectivity
- Try shorter prompts for faster processing

## Future Enhancements

🎯 Suggested features:
- [ ] Chat history persistence (localStorage/backend)
- [ ] Multiple language support for JD generation
- [ ] Template library for quick start
- [ ] JD scoring/quality feedback
- [ ] Bulk JD generation for multiple roles
- [ ] Integration with job board posting
- [ ] Analytics on generated vs. manual JDs
- [ ] Custom model/prompt configuration

## File Structure

```
GreatHire/
├── main.py                                    # Backend JD service
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── recruiter/
│   │   │       └── ChatAssistant.jsx          # Chat widget component
│   │   └── pages/
│   │       └── recruiter/
│   │           └── postJob/
│   │               └── PostJob.jsx             # Integrated form
│   └── package.json
└── requirements.txt
```

## Contributing

To improve the chatbot:

1. **Improve Prompts**: Edit system prompts in `main.py` endpoints
2. **Enhance UI**: Update `ChatAssistant.jsx` component
3. **Add Features**: Extend form value integration in `PostJob.jsx`
4. **Test**: Add test cases for edge scenarios

## Support

For issues or questions:
- Check error messages in browser console
- Review backend logs for API errors
- Test with sample inputs first
- Contact GreatHire support

---

**Last Updated**: May 2026  
**Status**: Production Ready  
**Version**: 1.0.0
