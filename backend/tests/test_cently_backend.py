"""Cently backend test suite — pytest, JUnit-friendly."""
import os
import uuid
import pytest
import requests
from pathlib import Path
from dotenv import load_dotenv

# Load frontend .env for REACT_APP_BACKEND_URL
load_dotenv(Path(__file__).resolve().parents[2] / "frontend" / ".env")

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
ADMIN_EMAIL = "admin@cently.com"
ADMIN_PASSWORD = "Cently@2026"


@pytest.fixture(scope="session")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


@pytest.fixture(scope="session")
def admin_token(s):
    r = s.post(f"{BASE_URL}/api/auth/login",
               json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=20)
    if r.status_code != 200:
        pytest.skip(f"Admin login failed: {r.status_code} {r.text}")
    return r.json()["access_token"]


@pytest.fixture(scope="session")
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# -------- Health & Public --------
class TestPublic:
    def test_root(self, s):
        r = s.get(f"{BASE_URL}/api/", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert "message" in data and data.get("brand") == "CENTLY"

    def test_products_list(self, s):
        r = s.get(f"{BASE_URL}/api/products", timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 19, f"expected >=19 products, got {len(data)}"
        # Verify mongo _id excluded and required fields
        sample = data[0]
        assert "_id" not in sample
        for f in ["id", "slug", "name", "category", "price", "diamond_clarity", "diamond_colour", "metal"]:
            assert f in sample, f"missing field {f}"
        assert "VVS" in sample["diamond_clarity"]
        assert "9ct" in sample["metal"]

    def test_product_detail_known_slug(self, s):
        r = s.get(f"{BASE_URL}/api/products/classic-round-brilliant-stud", timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert d["slug"] == "classic-round-brilliant-stud"
        assert d["category"] == "studs"
        assert "_id" not in d

    def test_product_detail_404(self, s):
        r = s.get(f"{BASE_URL}/api/products/nonexistent-xyz", timeout=15)
        assert r.status_code == 404

    def test_categories(self, s):
        r = s.get(f"{BASE_URL}/api/categories", timeout=15)
        assert r.status_code == 200
        cats = r.json()
        assert len(cats) == 8
        slugs = {c["slug"] for c in cats}
        assert {"studs", "earrings", "rings", "necklaces", "bracelets", "lockets", "bridal", "accessories"} <= slugs

    def test_journal(self, s):
        r = s.get(f"{BASE_URL}/api/journal", timeout=15)
        assert r.status_code == 200
        arts = r.json()
        assert len(arts) == 4
        for a in arts:
            assert "title" in a and "slug" in a

    def test_newsletter_subscribe(self, s):
        email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        r = s.post(f"{BASE_URL}/api/newsletter", json={"email": email}, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert d["success"] is True
        assert d.get("discount_code") == "CENTLY10"

    def test_newsletter_invalid_email(self, s):
        r = s.post(f"{BASE_URL}/api/newsletter", json={"email": "not-an-email"}, timeout=15)
        assert r.status_code == 422

    def test_contact_submit(self, s):
        r = s.post(f"{BASE_URL}/api/contact", json={
            "full_name": "TEST_Aria", "email": "test_aria@example.com",
            "enquiry_type": "general", "message": "Need ring size help"
        }, timeout=15)
        assert r.status_code == 200
        assert r.json()["success"] is True

    def test_consultation_book(self, s):
        r = s.post(f"{BASE_URL}/api/consultation", json={
            "full_name": "TEST_Bridal", "email": "test_bridal@example.com",
            "phone": "9999999999", "consultation_type": "bridal",
            "mode": "video", "preferred_date": "2026-02-14", "notes": "Engagement"
        }, timeout=15)
        assert r.status_code == 200
        assert r.json()["success"] is True

    def test_create_mock_order(self, s):
        payload = {
            "customer_name": "TEST_Customer", "email": "test_buyer@example.com",
            "phone": "9999900000", "address_line": "1 Test Lane",
            "city": "Mumbai", "state": "MH", "pincode": "400001",
            "items": [{
                "product_id": "p-001", "slug": "classic-round-brilliant-stud",
                "name": "Classic Round Brilliant Stud", "price": 3499,
                "quantity": 1, "image": "https://example.com/x.jpg"
            }],
            "subtotal": 3499, "shipping": 0, "total": 3499
        }
        r = s.post(f"{BASE_URL}/api/orders", json=payload, timeout=20)
        assert r.status_code == 200
        d = r.json()
        assert d["success"] is True
        assert d["order_number"].startswith("CNT-")
        assert d["amount"] == 3499
        assert "razorpay_order_id" in d


# -------- Auth --------
class TestAuth:
    def test_login_success(self, s):
        r = s.post(f"{BASE_URL}/api/auth/login",
                   json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert "access_token" in d and len(d["access_token"]) > 20
        assert d["user"]["email"] == ADMIN_EMAIL
        assert d["user"]["role"] == "admin"

    def test_login_bad_password(self, s):
        r = s.post(f"{BASE_URL}/api/auth/login",
                   json={"email": ADMIN_EMAIL, "password": "wrong"}, timeout=15)
        assert r.status_code == 401

    def test_login_unknown_user(self, s):
        r = s.post(f"{BASE_URL}/api/auth/login",
                   json={"email": "noone@cently.com", "password": "Cently@2026"}, timeout=15)
        assert r.status_code == 401

    def test_me_with_token(self, s, admin_headers):
        r = s.get(f"{BASE_URL}/api/auth/me", headers=admin_headers, timeout=15)
        assert r.status_code == 200
        u = r.json()
        assert u["email"] == ADMIN_EMAIL
        assert u["role"] == "admin"
        assert "password_hash" not in u


# -------- Admin protected --------
ADMIN_PATHS = [
    "/api/admin/stats",
    "/api/admin/orders",
    "/api/admin/newsletter",
    "/api/admin/contact",
    "/api/admin/consultations",
    "/api/admin/products",
]


class TestAdminProtected:
    @pytest.mark.parametrize("path", ADMIN_PATHS)
    def test_unauthenticated_401(self, s, path):
        r = s.get(f"{BASE_URL}{path}", timeout=15)
        assert r.status_code == 401, f"{path} expected 401, got {r.status_code}"

    @pytest.mark.parametrize("path", ADMIN_PATHS)
    def test_authenticated_200(self, s, admin_headers, path):
        r = s.get(f"{BASE_URL}{path}", headers=admin_headers, timeout=20)
        assert r.status_code == 200, f"{path} -> {r.status_code} {r.text[:200]}"
        data = r.json()
        if path.endswith("/stats"):
            assert "products" in data and "orders" in data
        else:
            assert isinstance(data, list)

    def test_admin_with_invalid_token(self, s):
        r = s.get(f"{BASE_URL}/api/admin/stats",
                  headers={"Authorization": "Bearer invalid.jwt.token"}, timeout=15)
        assert r.status_code == 401
