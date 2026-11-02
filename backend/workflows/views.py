from rest_framework import viewsets

from .models import WorkflowItem
from .serializers import WorkflowItemSerializer


class WorkflowItemViewSet(viewsets.ModelViewSet):
    """Full CRUD for the logged-in user's workflow items.

    GET    /api/items/       list
    POST   /api/items/       create
    GET    /api/items/{id}/  retrieve
    PUT    /api/items/{id}/  update
    PATCH  /api/items/{id}/  partial update (e.g. status only)
    DELETE /api/items/{id}/  delete
    """

    serializer_class = WorkflowItemSerializer

    def get_queryset(self):
        # Users only ever see their own items
        return WorkflowItem.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
