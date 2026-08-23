from django.db import models


class PublishableModel(models.Model):
    is_published = models.BooleanField("已发布", default=True)
    sort_order = models.PositiveIntegerField("排序", default=0)

    class Meta:
        abstract = True
        ordering = ["sort_order", "-pk"]


class Video(PublishableModel):
    slug = models.SlugField("标识", unique=True)
    title = models.CharField("标题", max_length=200)
    description = models.TextField("描述", blank=True)
    thumbnail = models.CharField("缩略图", max_length=500, blank=True)
    duration = models.CharField("时长", max_length=30, blank=True)
    published_at = models.CharField("发布日期", max_length=30, blank=True)
    bvid = models.CharField("BVID", max_length=50, blank=True)

    class Meta:
        verbose_name = "教学视频"
        verbose_name_plural = "教学视频"
        ordering = ["sort_order", "-pk"]

    def __str__(self):
        return self.title


class Product(PublishableModel):
    slug = models.SlugField("标识", unique=True)
    name = models.CharField("名称", max_length=200)
    description = models.TextField("描述", blank=True)
    price = models.CharField("价格", max_length=100, blank=True)
    image = models.CharField("图片", max_length=500, blank=True)
    external_url = models.URLField("外部链接", blank=True)

    class Meta:
        verbose_name = "商品"
        verbose_name_plural = "商品"
        ordering = ["sort_order", "-pk"]

    def __str__(self):
        return self.name


class Resource(PublishableModel):
    slug = models.SlugField("标识", unique=True)
    name = models.CharField("名称", max_length=200)
    description = models.TextField("描述", blank=True)
    category = models.CharField("分类", max_length=80, blank=True)
    resource_type = models.CharField("类型", max_length=30, default="download")
    download_url = models.URLField("下载链接", blank=True)
    file_name = models.CharField("文件名", max_length=255, blank=True)
    extract_code = models.CharField("提取码", max_length=50, blank=True)
    archive_password = models.CharField("解压密码", max_length=100, blank=True)
    updated_at = models.DateField("更新时间", null=True, blank=True)

    class Meta:
        verbose_name = "资料资源"
        verbose_name_plural = "资料资源"
        ordering = ["sort_order", "-pk"]

    def __str__(self):
        return self.name


class FAQ(PublishableModel):
    question = models.CharField("问题", max_length=300)
    answer = models.TextField("答案")

    class Meta:
        verbose_name = "常见问题"
        verbose_name_plural = "常见问题"
        ordering = ["sort_order", "-pk"]

    def __str__(self):
        return self.question


class JournalPost(PublishableModel):
    slug = models.SlugField("标识", unique=True)
    title = models.CharField("标题", max_length=200)
    content = models.TextField("正文", blank=True)
    category = models.CharField("分类", max_length=80, blank=True)
    tags = models.JSONField("标签", default=list, blank=True)
    images = models.JSONField("图片", default=list, blank=True)
    attachments = models.JSONField("附件", default=list, blank=True)
    links = models.JSONField("参考链接", default=list, blank=True)
    is_pinned = models.BooleanField("置顶", default=False)
    created_at = models.DateTimeField("创建时间", auto_now_add=True)
    updated_at = models.DateTimeField("更新时间", auto_now=True)

    class Meta:
        verbose_name = "学习日志"
        verbose_name_plural = "学习日志"
        ordering = ["-is_pinned", "-created_at"]

    def __str__(self):
        return self.title
