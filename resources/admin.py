from django.contrib import admin

from .models import FAQ, JournalPost, Product, Resource, Video


class PublishableAdmin(admin.ModelAdmin):
    list_filter = ("is_published",)
    list_display = ("__str__", "is_published", "sort_order")
    list_editable = ("is_published", "sort_order")


@admin.register(Video)
class VideoAdmin(PublishableAdmin):
    list_display = ("title", "published_at", "is_published", "sort_order")
    search_fields = ("title", "description", "bvid")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(Product)
class ProductAdmin(PublishableAdmin):
    list_display = ("name", "price", "is_published", "sort_order")
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Resource)
class ResourceAdmin(PublishableAdmin):
    list_display = ("name", "category", "resource_type", "updated_at", "is_published", "sort_order")
    list_filter = ("is_published", "category", "resource_type")
    search_fields = ("name", "description", "category")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(FAQ)
class FAQAdmin(PublishableAdmin):
    list_display = ("question", "is_published", "sort_order")
    search_fields = ("question", "answer")


@admin.register(JournalPost)
class JournalPostAdmin(PublishableAdmin):
    list_display = ("title", "category", "is_pinned", "is_published", "sort_order", "updated_at")
    list_filter = ("is_published", "is_pinned", "category")
    search_fields = ("title", "content", "category")
    prepopulated_fields = {"slug": ("title",)}


admin.site.site_header = "TraceDev 管理后台"
admin.site.site_title = "TraceDev 管理后台"
admin.site.index_title = "内容管理"
