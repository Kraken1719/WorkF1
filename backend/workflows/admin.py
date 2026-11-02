from django.contrib import admin

from .models import WorkflowItem


@admin.register(WorkflowItem)
class WorkflowItemAdmin(admin.ModelAdmin):
    list_display = ["title", "status", "owner", "created_at"]
    list_filter = ["status"]
