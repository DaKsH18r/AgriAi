import os
import logging
from typing import Optional, List, Dict
from dotenv import load_dotenv
from groq import Groq

# Setup logging
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Get API key from settings or environment
GROQ_API_KEY = os.getenv("GROQ_API_KEY")


class ChatbotService:
    
    # Model configuration
    MODEL = "llama-3.3-70b-versatile"
    MAX_TOKENS = 500
    TEMPERATURE = 0.7
    
    # System prompt for agriculture context
    SYSTEM_PROMPT = """You are an expert agricultural assistant helping farmers in India. 
You provide practical, helpful advice on:
- Crop selection and planting times
- Pest and disease management
- Soil health and fertilizers
- Irrigation and water management
- Weather-based farming decisions
- Market prices and selling strategies
- Organic farming methods

Keep responses:
- Simple and easy to understand
- Practical and actionable
- Specific to Indian farming conditions
- Under 200 words unless detailed explanation needed

If asked about weather, remind them to check the weather dashboard.
If asked about prices, mention the price prediction feature."""

    def __init__(self):
        if not GROQ_API_KEY:
            logger.warning("GROQ_API_KEY not set. Chatbot will not function.")
            self.client = None
        else:
            self.client = Groq(api_key=GROQ_API_KEY)
            logger.info("ChatbotService initialized with Groq API")
    
    def _is_available(self) -> bool:
        return self.client is not None
    
    def get_response(self, user_message: str, chat_history: Optional[List[Dict]] = None) -> str:
        if not self._is_available():
            return "⚠️ Chatbot is not configured. Please contact the administrator to set up GROQ_API_KEY."
        
        try:
            response = self.client.chat.completions.create(
                model=self.MODEL,
                messages=[
                    {"role": "system", "content": self.SYSTEM_PROMPT},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=self.MAX_TOKENS,
                temperature=self.TEMPERATURE
            )
            return response.choices[0].message.content
            
        except Exception as e:
            return self._handle_error(e)
    
    def get_response_with_history(self, user_message: str, chat_history: List[Dict]) -> str:
        if not self._is_available():
            return "⚠️ Chatbot is not configured. Please contact the administrator."
        
        try:
            messages = [{"role": "system", "content": self.SYSTEM_PROMPT}]
            
            # Add previous messages from history
            for msg in chat_history[-10:]:  # Limit to last 10 messages
                messages.append({
                    "role": msg.get('role', 'user'),
                    "content": msg.get('content', '')
                })
            
            # Add current message
            messages.append({"role": "user", "content": user_message})
            
            response = self.client.chat.completions.create(
                model=self.MODEL,
                messages=messages,
                max_tokens=self.MAX_TOKENS,
                temperature=self.TEMPERATURE
            )
            return response.choices[0].message.content
            
        except Exception as e:
            return self._handle_error(e)
    
    def _handle_error(self, error: Exception) -> str:
        error_msg = str(error).lower()
        logger.error(f"Chatbot error: {error}")
        
        if "429" in error_msg or "rate" in error_msg:
            return "⏳ The AI assistant is busy due to high demand. Please wait a minute and try again."
        elif "401" in error_msg or "invalid" in error_msg:
            return "🔑 Authentication error. Please contact the administrator."
        elif "timeout" in error_msg:
            return "⏱️ Request timed out. Please try again."
        else:
            return f"❌ Sorry, I encountered an error. Please try again later."


# Singleton instance
_chatbot_service: Optional[ChatbotService] = None


def get_chatbot_service() -> ChatbotService:
    global _chatbot_service
    if _chatbot_service is None:
        _chatbot_service = ChatbotService()
    return _chatbot_service
