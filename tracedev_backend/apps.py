from django.apps import AppConfig


class TraceDevBackendConfig(AppConfig):
    name = "tracedev_backend"

    def ready(self):
        from django.conf import settings

        middleware = "django.middleware.clickjacking.XFrameOptionsMiddleware"
        if middleware not in settings.MIDDLEWARE:
            settings.MIDDLEWARE.append(middleware)
