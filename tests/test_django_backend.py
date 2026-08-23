from django.conf import settings
from django.contrib import admin
from django.test import SimpleTestCase

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
