from django.conf import settings
from django.contrib import admin
from django.test import SimpleTestCase
from pathlib import Path

from resources.models import FAQ, JournalPost, Product, Resource, Video


class BackendConfigurationTests(SimpleTestCase):
    def test_django_frontend_and_admin_pages_are_available(self):
        self.assertEqual(self.client.get("/").status_code, 200)
        self.assertEqual(self.client.get("/admin/login/").status_code, 200)

    def test_admin_uses_django_language_cookie(self):
        self.client.cookies[settings.LANGUAGE_COOKIE_NAME] = "en"
        response = self.client.get("/admin/login/")
        self.assertEqual(response.headers["Content-Language"], "en")

    def test_public_data_keeps_posts_available_but_blocks_local_auth_files(self):
        self.assertEqual(self.client.get("/data/posts.json").status_code, 200)
        self.assertEqual(self.client.get("/data/admin.json").status_code, 404)
        self.assertEqual(self.client.get("/data/.secret").status_code, 404)

    def test_public_asset_routes_block_path_traversal(self):
        blocked_paths = (
            "/css/%2e%2e/manage.py",
            "/assets/%2e%2e/manage.py",
            "/js/../manage.py",
            "/uploads/%2e%2e/db.sqlite3",
        )
        for path in blocked_paths:
            with self.subTest(path=path):
                self.assertEqual(self.client.get(path).status_code, 404)

    def test_five_locale_configuration_is_present(self):
        self.assertEqual(
            {code for code, _label in settings.LANGUAGES},
            {"zh-hans", "zh-hant", "en", "ja", "ko"},
        )
        self.assertIn("django.middleware.locale.LocaleMiddleware", settings.MIDDLEWARE)

    def test_resource_models_are_registered_in_admin(self):
        self.assertIn(Video, admin.site._registry)
        self.assertIn(Product, admin.site._registry)
        self.assertIn(Resource, admin.site._registry)
        self.assertIn(FAQ, admin.site._registry)
        self.assertIn(JournalPost, admin.site._registry)

    def test_publishable_content_models_keep_explicit_sort_ordering(self):
        for model in (Video, Product, Resource, FAQ):
            with self.subTest(model=model.__name__):
                self.assertEqual(model._meta.ordering, ["sort_order", "-pk"])

    def test_project_has_python_hosting_configuration(self):
        base_dir = Path(settings.BASE_DIR)
        requirements = (base_dir / "requirements.txt").read_text(encoding="utf-8")
        render_blueprint = (base_dir / "render.yaml").read_text(encoding="utf-8")

        self.assertIn("whitenoise.middleware.WhiteNoiseMiddleware", settings.MIDDLEWARE)
        self.assertIn("django.middleware.clickjacking.XFrameOptionsMiddleware", settings.MIDDLEWARE)
        self.assertIn("gunicorn", requirements)
        self.assertIn("whitenoise", requirements)
        self.assertIn("dj-database-url", requirements)
        self.assertTrue((base_dir / "Procfile").exists())
        self.assertTrue((base_dir / "render.yaml").exists())
        self.assertIn("runtime: python", render_blueprint)
        self.assertIn("startCommand: gunicorn tracedev_backend.wsgi:application", render_blueprint)
