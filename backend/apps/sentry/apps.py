from django.apps import AppConfig

class SentryConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.sentry'
    verbose_name = 'Threat Sentry'

    def ready(self):
        import apps.sentry.signals