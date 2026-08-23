from django.conf import settings
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.http import Http404
from django.urls import include, path, re_path
from django.views.static import serve

from resources.views import index


urlpatterns = [
    path("i18n/", include("django.conf.urls.i18n")),
]

urlpatterns += [
    path("admin/", admin.site.urls),
    path("", index, name="index"),
]


def site_static(request, path):
    if path.startswith(("admin/", "simpleui/")):
        raise Http404
    return serve(request, path, document_root=settings.BASE_DIR)


def public_data(request, path):
    if path != "posts.json":
        raise Http404
    return serve(request, f"data/{path}", document_root=settings.BASE_DIR)


urlpatterns += [
    re_path(r"^(?P<path>(?:css|js|assets|downloads|uploads)/.*)$", site_static),
    re_path(r"^data/(?P<path>.*)$", public_data),
]
urlpatterns += staticfiles_urlpatterns()
