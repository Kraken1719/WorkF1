from django.contrib.auth.models import User
from rest_framework.test import APITestCase


class AuthTests(APITestCase):
    def test_register_returns_token(self):
        response = self.client.post(
            "/api/auth/register/",
            {"username": "alice", "email": "alice@example.com", "password": "StrongPass123"},
        )
        self.assertEqual(response.status_code, 201)
        self.assertIn("token", response.data)

    def test_duplicate_username_rejected(self):
        User.objects.create_user(username="alice", password="StrongPass123")
        response = self.client.post(
            "/api/auth/register/", {"username": "alice", "password": "StrongPass123"}
        )
        self.assertEqual(response.status_code, 400)

    def test_login_and_logout(self):
        User.objects.create_user(username="bob", password="StrongPass123")
        response = self.client.post(
            "/api/auth/login/", {"username": "bob", "password": "StrongPass123"}
        )
        self.assertEqual(response.status_code, 200)
        token = response.data["token"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
        response = self.client.post("/api/auth/logout/")
        self.assertEqual(response.status_code, 200)
