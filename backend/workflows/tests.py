from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from .models import WorkflowItem


class WorkflowItemTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="alice", password="StrongPass123")
        self.other = User.objects.create_user(username="bob", password="StrongPass123")
        self.client.force_authenticate(user=self.user)

    def test_create_item_defaults_to_pending(self):
        response = self.client.post("/api/items/", {"title": "Write report"})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["status"], "PENDING")

    def test_title_is_required(self):
        response = self.client.post("/api/items/", {"description": "No title"})
        self.assertEqual(response.status_code, 400)

    def test_update_status(self):
        item = WorkflowItem.objects.create(owner=self.user, title="Task")
        response = self.client.patch(f"/api/items/{item.id}/", {"status": "COMPLETED"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "COMPLETED")

    def test_invalid_status_rejected(self):
        item = WorkflowItem.objects.create(owner=self.user, title="Task")
        response = self.client.patch(f"/api/items/{item.id}/", {"status": "DONE"})
        self.assertEqual(response.status_code, 400)

    def test_user_only_sees_own_items(self):
        WorkflowItem.objects.create(owner=self.user, title="Mine")
        WorkflowItem.objects.create(owner=self.other, title="Not mine")
        response = self.client.get("/api/items/")
        self.assertEqual(len(response.data), 1)

    def test_cannot_delete_other_users_item(self):
        item = WorkflowItem.objects.create(owner=self.other, title="Not mine")
        response = self.client.delete(f"/api/items/{item.id}/")
        self.assertEqual(response.status_code, 404)

    def test_requires_login(self):
        self.client.force_authenticate(user=None)
        response = self.client.get("/api/items/")
        self.assertEqual(response.status_code, 401)
