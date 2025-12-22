import os
import re
import google.generativeai as genai
from dotenv import load_dotenv
from app.services.agent_service import smart_agent

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

class ChatbotService:
    
    def __init__(self):
        # Configure the model
        self.model = genai.GenerativeModel('gemini-flash-latest')
        
        # System prompt for agriculture context
        self.system_context = """
        You are an expert agricultural assistant helping farmers in India. 
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
        If asked about prices, mention the price prediction feature.
        """
    
    def get_response(self, user_message: str, chat_history: list = None) -> str:
        """Get chatbot response for user message"""
        try:
            # Combine system context with user message
            full_prompt = f"{self.system_context}\n\nUser Question: {user_message}\n\nAssistant:"
            
            # Generate response
            response = self.model.generate_content(full_prompt)
            
            return response.text
            
        except Exception as e:
            error_msg = str(e)
            if "429" in error_msg or "quota" in error_msg.lower():
                return "⚠️ The AI assistant is temporarily busy due to high demand. Please wait a minute and try again. This happens when many farmers are using the service at once."
            return f"Sorry, I encountered an error: {error_msg}. Please try again."
    
    def get_response_with_history(self, user_message: str, chat_history: list) -> str:
        """Get response with conversation history for context"""
        try:
            # Start a chat session
            chat = self.model.start_chat(history=[])
            
            # Add system context as first message
            chat.send_message(self.system_context)
            
            # Add previous messages from history
            for msg in chat_history:
                if msg['role'] == 'user':
                    chat.send_message(msg['content'])
            
            # Send current message
            response = chat.send_message(user_message)
            
            return response.text
            
        except Exception as e:
            error_msg = str(e)
            if "429" in error_msg or "quota" in error_msg.lower():
                return "⚠️ The AI assistant is temporarily busy due to high demand. Please wait a minute and try again. This happens when many farmers are using the service at once."
            return f"Sorry, I encountered an error: {error_msg}. Please try again."
        
""" -->Configures Gemini AI with your API key
-->Sets up agriculture-specific system prompt
-->Provides functions to get chatbot responses
-->Handles conversation history """