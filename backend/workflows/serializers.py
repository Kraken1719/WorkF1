from rest_framework import serializers

from .models import WorkflowItem


class WorkflowItemSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = WorkflowItem
        fields = ["id", "title", "description", "status", "owner", "created_at", "updated_at"]
