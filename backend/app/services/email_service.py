"""
Email Service - Production-grade email sending
Supports both SendGrid (recommended) and SMTP (Gmail, Outlook, etc.)
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


class EmailService:
    """Email service supporting SendGrid and SMTP."""
    
    def __init__(self):
        self.enabled = settings.EMAIL_ENABLED
        self.sendgrid_api_key = settings.SENDGRID_API_KEY
        self.smtp_configured = all([
            settings.SMTP_HOST,
            settings.SMTP_USER,
            settings.SMTP_PASSWORD,
            settings.SMTP_FROM_EMAIL
        ])
        
        if self.enabled:
            if self.sendgrid_api_key:
                logger.info("📧 Email service: SendGrid configured")
            elif self.smtp_configured:
                logger.info(f"📧 Email service: SMTP configured ({settings.SMTP_HOST})")
            else:
                logger.warning("⚠️ EMAIL_ENABLED=True but no email service configured!")
                self.enabled = False
        else:
            logger.info("📧 Email service: Disabled (console-only mode)")
    
    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None
    ) -> bool:
        """
        Send email using configured service.
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            html_content: HTML email body
            text_content: Plain text fallback (optional)
        
        Returns:
            bool: True if sent successfully, False otherwise
        """
        if not self.enabled:
            # Console-only mode for development
            self._log_email_to_console(to_email, subject, html_content)
            return True
        
        try:
            if self.sendgrid_api_key:
                return await self._send_via_sendgrid(to_email, subject, html_content, text_content)
            elif self.smtp_configured:
                return await self._send_via_smtp(to_email, subject, html_content, text_content)
            else:
                logger.error("No email service configured")
                return False
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
            # Fallback to console in case of error
            self._log_email_to_console(to_email, subject, html_content)
            return False
    
    async def _send_via_sendgrid(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str]
    ) -> bool:
        """Send email via SendGrid API."""
        try:
            from sendgrid import SendGridAPIClient
            from sendgrid.helpers.mail import Mail, Email, To, Content
            
            message = Mail(
                from_email=Email(
                    settings.SMTP_FROM_EMAIL or "noreply@agri-ai.com",
                    settings.SMTP_FROM_NAME
                ),
                to_emails=To(to_email),
                subject=subject,
                html_content=Content("text/html", html_content)
            )
            
            if text_content:
                message.add_content(Content("text/plain", text_content))
            
            sg = SendGridAPIClient(self.sendgrid_api_key)
            response = sg.send(message)
            
            if response.status_code in [200, 201, 202]:
                logger.info(f"✅ Email sent to {to_email} via SendGrid")
                return True
            else:
                logger.error(f"SendGrid error: {response.status_code}")
                return False
                
        except ImportError:
            logger.error("SendGrid library not installed. Run: pip install sendgrid")
            return False
        except Exception as e:
            logger.error(f"SendGrid error: {str(e)}")
            return False
    
    async def _send_via_smtp(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str]
    ) -> bool:
        """Send email via SMTP (Gmail, Outlook, etc.)."""
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
            msg['To'] = to_email
            
            # Add plain text version if provided
            if text_content:
                part1 = MIMEText(text_content, 'plain')
                msg.attach(part1)
            
            # Add HTML version
            part2 = MIMEText(html_content, 'html')
            msg.attach(part2)
            
            # Send via SMTP
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.send_message(msg)
            
            logger.info(f"✅ Email sent to {to_email} via SMTP")
            return True
            
        except Exception as e:
            logger.error(f"SMTP error: {str(e)}")
            return False
    
    def _log_email_to_console(self, to_email: str, subject: str, html_content: str):
        """Log email to console (development mode)."""
        logger.info("\n" + "="*80)
        logger.info("📧 EMAIL (Console Mode - Development Only)")
        logger.info("="*80)
        logger.info(f"To: {to_email}")
        logger.info(f"Subject: {subject}")
        logger.info("-"*80)
        # Extract text from HTML for console display
        import re
        text = re.sub('<[^<]+?>', '', html_content)
        logger.info(text)
        logger.info("="*80 + "\n")
    
    async def send_password_reset_email(
        self,
        to_email: str,
        reset_link: str,
        user_name: Optional[str] = None
    ) -> bool:
        """
        Send password reset email with professional template.
        
        Args:
            to_email: User's email address
            reset_link: Password reset link with token
            user_name: User's name for personalization
        
        Returns:
            bool: True if sent successfully
        """
        display_name = user_name or to_email.split('@')[0]
        
        # HTML email template
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
                <tr>
                    <td align="center">
                        <!-- Main Container -->
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
                            <!-- Header -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); padding: 40px 20px; text-align: center;">
                                    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                                        🌾 AgriAI
                                    </h1>
                                    <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">
                                        Smart Farming Platform
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: 600;">
                                        Reset Your Password
                                    </h2>
                                    
                                    <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                        Hi {display_name},
                                    </p>
                                    
                                    <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                        We received a request to reset your password. Click the button below to create a new password:
                                    </p>
                                    
                                    <!-- CTA Button -->
                                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                        <tr>
                                            <td align="center">
                                                <a href="{reset_link}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                                                    Reset My Password
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <p style="margin: 20px 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
                                        Or copy and paste this link into your browser:
                                    </p>
                                    
                                    <p style="margin: 0 0 20px 0; padding: 12px; background-color: #f3f4f6; border-radius: 6px; color: #6b7280; font-size: 13px; word-break: break-all;">
                                        {reset_link}
                                    </p>
                                    
                                    <div style="margin: 30px 0; padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px;">
                                        <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                                            ⏰ <strong>This link expires in 1 hour</strong> for security reasons.
                                        </p>
                                    </div>
                                    
                                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                        If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                                        Need help? Contact us at <a href="mailto:support@agri-ai.com" style="color: #10b981; text-decoration: none;">support@agri-ai.com</a>
                                    </p>
                                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                        © 2025 AgriAI Platform. All rights reserved.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        
        # Plain text fallback
        text_content = f"""
        AgriAI - Reset Your Password
        
        Hi {display_name},
        
        We received a request to reset your password. Click the link below to create a new password:
        
        {reset_link}
        
        This link expires in 1 hour for security reasons.
        
        If you didn't request this password reset, you can safely ignore this email.
        
        Need help? Contact us at support@agri-ai.com
        
        © 2025 AgriAI Platform
        """
        
        return await self.send_email(
            to_email=to_email,
            subject="Reset Your AgriAI Password",
            html_content=html_content,
            text_content=text_content
        )
    
    async def send_welcome_email(
        self,
        to_email: str,
        user_name: Optional[str] = None
    ) -> bool:
        """Send welcome email to new users."""
        display_name = user_name or to_email.split('@')[0]
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Welcome to AgriAI</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                            <tr>
                                <td style="background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); padding: 40px 20px; text-align: center;">
                                    <h1 style="margin: 0; color: #ffffff; font-size: 32px;">🌾 Welcome to AgriAI!</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px;">Hi {display_name}! 👋</h2>
                                    <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                        Welcome to AgriAI - your smart farming companion! We're excited to have you on board.
                                    </p>
                                    <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                        Here's what you can do with AgriAI:
                                    </p>
                                    <ul style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.8;">
                                        <li>🤖 Get AI-powered farming insights</li>
                                        <li>🌦️ Real-time weather monitoring</li>
                                        <li>💰 Crop price predictions</li>
                                        <li>📊 Yield forecasting</li>
                                        <li>💬 24/7 AI chatbot assistant</li>
                                    </ul>
                                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                        <tr>
                                            <td align="center">
                                                <a href="{settings.FRONTEND_URL}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                                                    Get Started
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">© 2025 AgriAI Platform</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        
        text_content = f"""
        Welcome to AgriAI!
        
        Hi {display_name}!
        
        Welcome to AgriAI - your smart farming companion!
        
        Here's what you can do:
        - Get AI-powered farming insights
        - Real-time weather monitoring
        - Crop price predictions
        - Yield forecasting
        - 24/7 AI chatbot assistant
        
        Get started: {settings.FRONTEND_URL}
        
        © 2025 AgriAI Platform
        """
        
        return await self.send_email(
            to_email=to_email,
            subject="Welcome to AgriAI! 🌾",
            html_content=html_content,
            text_content=text_content
        )


# Global email service instance
email_service = EmailService()
