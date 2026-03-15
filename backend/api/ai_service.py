import os
import json
import google.generativeai as genai
from groq import Groq
from dotenv import load_dotenv

def generate_quiz_questions(topic, difficulty, num_questions=5):
    """
    Calls an AI API (Groq or Gemini) to generate multiple choice questions.
    Returns a list of dictionaries.
    """
    # Force reload of .env file to catch any recent changes (like adding the Groq key)
    load_dotenv(override=True)
    
    groq_key = os.environ.get("GROQ_API_KEY")
    gemini_key = os.environ.get("GEMINI_API_KEY")

    prompt = f"""
    You are an expert educator. Generate {num_questions} multiple choice questions about "{topic}" at a {difficulty} difficulty level.
    
    Output the result STRICTLY as a JSON array of objects, with no markdown formatting and no extra text.
    Each object must have the exact following keys:
    - "text": The question text
    - "option_a": First choice
    - "option_b": Second choice
    - "option_c": Third choice
    - "option_d": Fourth choice
    - "correct_option": The correct choice character, must be exactly "A", "B", "C", or "D".

    Example format:
    [
      {{
        "text": "What is 2+2?",
        "option_a": "3",
        "option_b": "4",
        "option_c": "5",
        "option_d": "6",
        "correct_option": "B"
      }}
    ]
    """

    if groq_key:
        try:
            client = Groq(api_key=groq_key)
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            response_text = response.choices[0].message.content.strip()
        except Exception as e:
            if "429" in str(e) or "quota" in str(e).lower():
                raise ValueError("Your Groq API key has exceeded its usage quota.") from e
            raise ValueError(f"Groq API error: {str(e)}") from e
    elif gemini_key:
        try:
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel('gemini-2.0-flash')
            response = model.generate_content(prompt)
            response_text = response.text.strip()
        except Exception as e:
            if "429" in str(e) or "Quota exceeded" in str(e):
                raise ValueError("Your Gemini API key has exceeded its usage quota. Please check your Google AI Studio plan.") from e
            raise ValueError(f"Gemini API error: {str(e)}") from e
    else:
        raise ValueError("Neither GROQ_API_KEY nor GEMINI_API_KEY is set in .env")

    # Clean up possible markdown code blocks if the model returns them anyway
    if response_text.startswith("```json"):
        response_text = response_text[7:]
    if response_text.endswith("```"):
        response_text = response_text[:-3]
    
    try:
        data = json.loads(response_text)
        # Handle cases where the AI might wrap the list in an object
        if isinstance(data, dict):
             # Try to find a list within the dict
             for val in data.values():
                 if isinstance(val, list):
                     return val
             # If it's a dict but no list found, might be the list itself if not correctly formatted
             return data
        return data
    except json.JSONDecodeError as e:
        print(f"Failed to parse JSON: {response_text}")
        raise ValueError("AI returned invalid data format") from e

