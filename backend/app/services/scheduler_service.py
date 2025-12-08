"""
Scheduler service for autonomous agent operations
Runs monitoring jobs automatically 24/7
"""

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class SchedulerService:
    """Manages automated agent tasks"""
    
    def __init__(self):
        self.scheduler = BackgroundScheduler()
        self.is_running = False
    
    def start(self):
        """Start autonomous monitoring"""
        if self.is_running:
            logger.warning("Scheduler already running")
            return
        
        # Import here to avoid circular dependency
        from app.services.agent_service import smart_agent
        from app.services.notification_service import notification_service
        
        # Daily analysis at 6 AM
        self.scheduler.add_job(
            lambda: self._daily_monitoring_job(smart_agent, notification_service),
            CronTrigger(hour=6, minute=0),
            id='daily_monitoring',
            name='Daily Crop Monitoring',
            replace_existing=True
        )
        
        # Price alerts every 6 hours
        self.scheduler.add_job(
            self._price_alert_job,
            CronTrigger(hour='*/6'),
            id='price_alerts',
            name='Price Alert Check',
            replace_existing=True
        )
        
        self.scheduler.start()
        self.is_running = True
        logger.info("✅ Production agent started - monitoring 24/7")
    
    def stop(self):
        """Stop the scheduler"""
        if self.scheduler.running:
            self.scheduler.shutdown()
            self.is_running = False
            logger.info("Scheduler stopped")
    
    def _daily_monitoring_job(self, smart_agent, notification_service):
        """6 AM daily analysis"""
        logger.info(f"🌅 Daily monitoring at {datetime.now()}")
        
        try:
            alerts = smart_agent.run_daily_monitoring()
            
            # Send notifications
            for alert in alerts:
                notification_service.send_alert(alert)
            
            logger.info(f"✅ Sent {len(alerts)} alerts")
            
        except Exception as e:
            logger.error(f"Daily job failed: {e}")
    
    def _price_alert_job(self):
        """6-hour price spike detection"""
        logger.info(f"💰 Price check at {datetime.now()}")
        # Can add rapid price change detection here
    
    def run_now(self, job_id: str):
        """Manual trigger for testing"""
        job = self.scheduler.get_job(job_id)
        if job:
            job.func()
            logger.info(f"Manually ran job: {job_id}")
        else:
            logger.warning(f"Job not found: {job_id}")


# Singleton instance
scheduler_service = SchedulerService()
