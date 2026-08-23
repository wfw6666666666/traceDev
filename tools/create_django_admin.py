import os
from pathlib import Path
import sys

import django


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tracedev_backend.settings")
django.setup()

from django.contrib.auth import get_user_model


username = "wfw"
password = os.environ.get("TRACEDEV_ADMIN_PASSWORD")
if not password:
    raise SystemExit("TRACEDEV_ADMIN_PASSWORD is required")

User = get_user_model()
user, created = User.objects.get_or_create(username=username, defaults={"email": ""})
user.email = ""
user.is_active = True
user.is_staff = True
user.is_superuser = True
user.set_password(password)
user.save()
print(f"Django superuser ready: {username} ({'created' if created else 'updated'})")
