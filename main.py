import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import Optional
from groq import Groq

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

GROQ_MODEL = "llama-3.3-70b-versatile"


class JDRequest(BaseModel):
    title: str
    department: str
    skills: str
    seniority: str
    work_mode: str
    additional_context: Optional[str] = ""


class RefineRequest(BaseModel):
    current_jd: str
    goal: str


@app.post("/generate-jd")
async def generate_jd(data: JDRequest):
    try:
        prompt = f"""Act as an expert HR Recruiter. Generate a professional Job Description.

Role: {data.title}
Department: {data.department}
Level: {data.seniority}
Work Mode: {data.work_mode}
Skills: {data.skills}
Context: {data.additional_context}

Format with these sections:
- About the Role
- Key Responsibilities
- Required Qualifications
- What We Offer (include salary/compensation details if provided in Context above)

If a salary range is mentioned in Context, include it naturally under "What We Offer".
If no salary is mentioned, write "Competitive compensation package"."""

        response = client.chat.completions.create(
            model=GROQ_MODEL,
            max_tokens=800,
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert HR Recruiter who writes clear, professional, and inclusive job descriptions. Always follow the section format exactly as instructed."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        jd_text = response.choices[0].message.content
        return {"jd": jd_text}

    except Exception as e:
        print("FULL ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/refine-jd")
async def refine_jd(data: RefineRequest):
    try:
        prompt = f"""Refine the following job description to be: {data.goal}

Job Description:
{data.current_jd}"""

        response = client.chat.completions.create(
            model=GROQ_MODEL,
            max_tokens=800,
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert HR Recruiter who refines and improves job descriptions."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        refined_text = response.choices[0].message.content
        return {"refined_jd": refined_text}

    except Exception as e:
        print("FULL ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)