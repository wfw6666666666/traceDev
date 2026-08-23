import mimetypes

from django.conf import settings
from django.core.exceptions import SuspiciousFileOperation
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.http import Http404
from django.urls import include, path, re_path
from django.views.static import serve

from resources.views import index


# Windows file associations can make django.views.static serve .js as text/plain.
# Explicitly register the web MIME type so browsers honor our nosniff header.
mimetypes.add_type("application/javascript", ".js", strict=True)


urlpatterns = [
    path("i18n/", include("django.conf.urls.i18n")),
]

urlpatterns += [
    path("admin/", admin.site.urls),
    path("", index, name="index"),
]


PUBLIC_DIRS = {
    "css": settings.BASE_DIR / "css",
    "js": settings.BASE_DIR / "js",
    "assets": settings.BASE_DIR / "assets",
    "downloads": settings.BASE_DIR / "downloads",
    "uploads": settings.BASE_DIR / "uploads",
}


def public_static(request, directory, path):
    document_root = PUBLIC_DIRS.get(directory)
    if document_root is None:
        raise Http404
    try:
        return serve(request, path, document_root=document_root)
    except SuspiciousFileOperation as exc:
        raise Http404 from exc


def public_data(request, path):
    if path != "posts.json":
        raise Http404
    return serve(request, f"data/{path}", document_root=settings.BASE_DIR)


urlpatterns += [
    re_path(r"^(?P<directory>css|js|assets|downloads|uploads)/(?P<path>.*)$", public_static),
    re_path(r"^data/(?P<path>.*)$", public_data),
]
urlpatterns += staticfiles_urlpatterns()
