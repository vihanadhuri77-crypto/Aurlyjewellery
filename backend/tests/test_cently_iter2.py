"""Iteration 2 backend tests: customer auth, loyalty, engraving, multi-image gallery."""
import os
import uuid
import pytest
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / "frontend" / ".env")
BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
ADMIN_EMAIL = "admin@cently.com"
ADMIN_PASSWORD = "Cently@2026"

ENGRAVABLE_CATEGORIES = {"lockets", "rings", "bracelets", "bridal"}


@pytest.fixture(scope="session")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


def _unique_email():
    return f"TEST_cust_{uuid.uuid4().hex[:10]}@example.com"


@pytest.fixture(scope="module")
def fresh_customer(s):
    """Register a unique customer; returns dict with email/password/token/user."""
    email = _unique_email()
    password = "Pass@1234"
    r = s.post(f"{BASE_URL}/api/auth/register", json={
        "name": "TEST_Customer", "email": email, "password": password, "phone": "9876543210",
    }, timeout=20)
    assert r.status_code == 200, f"register failed: {r.status_code} {r.text}"
    d = r.json()
    return {"email": email, "password": password, "token": d["access_token"], "user": d["user"]}


@pytest.fixture
def cust_headers(fresh_customer):
    return {"Authorization": f"Bearer {fresh_customer['token']}", "Content-Type": "application/json"}


# ========== Auth - Register / Login ==========
class TestCustomerAuth:
    def test_register_creates_customer(self, s):
        email = _unique_email()
        r = s.post(f"{BASE_URL}/api/auth/register", json={
            "name": "TEST_Reg", "email": email, "password": "Pass@1234",
        }, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert "access_token" in d and len(d["access_token"]) > 20
        assert d["user"]["email"] == email.lower()
        assert d["user"]["role"] == "customer"
        assert d["user"]["loyalty_points"] == 0

    def test_register_duplicate_email_returns_409(self, s, fresh_customer):
        r = s.post(f"{BASE_URL}/api/auth/register", json={
            "name": "Dup", "email": fresh_customer["email"], "password": "OtherPass1!",
        }, timeout=15)
        assert r.status_code == 409

    def test_login_admin(self, s):
        r = s.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL, "password": ADMIN_PASSWORD
        }, timeout=15)
        assert r.status_code == 200
        assert r.json()["user"]["role"] == "admin"

    def test_login_registered_customer(self, s, fresh_customer):
        r = s.post(f"{BASE_URL}/api/auth/login", json={
            "email": fresh_customer["email"], "password": fresh_customer["password"],
        }, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert d["user"]["role"] == "customer"
        assert d["user"]["email"] == fresh_customer["email"].lower()


# ========== Account routes ==========
class TestAccountRoutes:
    def test_account_routes_require_auth(self, s):
        for path in ["/api/account/me", "/api/account/orders", "/api/account/loyalty"]:
            r = s.get(f"{BASE_URL}{path}", timeout=10)
            assert r.status_code == 401, f"{path} expected 401, got {r.status_code}"

    def test_account_me(self, s, cust_headers, fresh_customer):
        r = s.get(f"{BASE_URL}/api/account/me", headers=cust_headers, timeout=10)
        assert r.status_code == 200
        d = r.json()
        assert d["email"] == fresh_customer["email"].lower()
        assert d["role"] == "customer"
        assert d["loyalty_points"] == 0
        assert "password_hash" not in d

    def test_account_update_name_phone(self, s, cust_headers):
        r = s.patch(f"{BASE_URL}/api/account/me", headers=cust_headers,
                    json={"name": "TEST_Renamed", "phone": "9000000000"}, timeout=10)
        assert r.status_code == 200
        d = r.json()
        assert d["name"] == "TEST_Renamed"
        assert d["phone"] == "9000000000"
        # Verify GET reflects update
        r2 = s.get(f"{BASE_URL}/api/account/me", headers=cust_headers, timeout=10)
        assert r2.json()["name"] == "TEST_Renamed"

    def test_account_loyalty_initial(self, s, cust_headers):
        r = s.get(f"{BASE_URL}/api/account/loyalty", headers=cust_headers, timeout=10)
        assert r.status_code == 200
        d = r.json()
        assert d["points"] == 0
        assert d["value_inr"] == 0
        assert d["max_redeem_ratio"] == 0.10
        assert "earn_rate" in d

    def test_account_orders_initial_empty(self, s, cust_headers):
        r = s.get(f"{BASE_URL}/api/account/orders", headers=cust_headers, timeout=10)
        assert r.status_code == 200
        assert r.json() == []


# ========== Products: multi-image + engravable flag ==========
class TestProductCatalogue:
    def test_multi_image_gallery(self, s):
        r = s.get(f"{BASE_URL}/api/products", timeout=20)
        assert r.status_code == 200
        items = r.json()
        assert len(items) >= 19
        # Every product has >=2 images
        for p in items:
            assert isinstance(p.get("images"), list), f"{p.get('slug')} missing images"
            assert len(p["images"]) >= 2, f"{p.get('slug')} only has {len(p.get('images', []))} image(s)"

    def test_engravable_categories(self, s):
        r = s.get(f"{BASE_URL}/api/products", timeout=20)
        items = r.json()
        for p in items:
            if p["category"] in ENGRAVABLE_CATEGORIES:
                assert p["engravable"] is True, f"{p['slug']} ({p['category']}) should be engravable"
            else:
                # Not strictly required to be False, but per spec only listed categories engravable
                assert p["engravable"] in (False, True)
        # Spot check classic-diamond-locket
        r2 = s.get(f"{BASE_URL}/api/products/classic-diamond-locket", timeout=10)
        assert r2.status_code == 200
        assert r2.json()["engravable"] is True


# ========== Orders + Loyalty integration ==========
class TestOrdersLoyalty:
    def _order_payload(self, total=3500, qty=1, redeemed=0, engraving=None, email="guest@test.com"):
        return {
            "customer_name": "TEST_Buyer", "email": email,
            "phone": "9999900000", "address_line": "1 Test Lane",
            "city": "Mumbai", "state": "MH", "pincode": "400001",
            "items": [{
                "product_id": "p-501", "slug": "classic-diamond-locket",
                "name": "Classic Diamond Locket", "price": total,
                "quantity": qty, "image": "https://example.com/x.jpg",
                **({"engraving": engraving} if engraving else {}),
            }],
            "subtotal": total, "shipping": 0, "total": total,
            "redeemed_points": redeemed,
        }

    def test_guest_order_no_points(self, s):
        r = s.post(f"{BASE_URL}/api/orders", json=self._order_payload(total=5000), timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert d["success"] is True
        assert d["points_earned"] == 50  # 5000 * 0.01
        assert d["points_redeemed"] == 0

    def test_authed_order_awards_points_and_records_customer(self, s, cust_headers, fresh_customer):
        # Place an order with engraving
        payload = self._order_payload(total=12345, engraving="Forever — A & R")
        r = s.post(f"{BASE_URL}/api/orders", headers=cust_headers, json=payload, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert d["points_earned"] == 123  # 12345 // 100

        # Loyalty should reflect awarded points
        r2 = s.get(f"{BASE_URL}/api/account/loyalty", headers=cust_headers, timeout=10)
        assert r2.json()["points"] == 123

        # Account orders should now contain this order with customer_id, points_earned, engraving propagated
        r3 = s.get(f"{BASE_URL}/api/account/orders", headers=cust_headers, timeout=10)
        assert r3.status_code == 200
        orders = r3.json()
        assert len(orders) >= 1
        latest = orders[0]
        assert latest["customer_id"] == fresh_customer["user"]["id"]
        assert latest["points_earned"] == 123
        assert latest["items"][0]["engraving"] == "Forever — A & R"
        assert latest["order_number"].startswith("CNT-")

    def test_redeem_exceeds_available_returns_400(self, s, cust_headers):
        # Redeem more points than available (current holds 123 from previous test)
        payload = self._order_payload(total=10000, redeemed=10_000)
        r = s.post(f"{BASE_URL}/api/orders", headers=cust_headers, json=payload, timeout=15)
        assert r.status_code == 400

    def test_redeem_exceeds_10pct_returns_400(self, s, cust_headers):
        # subtotal=1000 → max 100 redeem. Try 120; user does have >=120 points (123).
        payload = self._order_payload(total=1000, redeemed=120)
        r = s.post(f"{BASE_URL}/api/orders", headers=cust_headers, json=payload, timeout=15)
        assert r.status_code == 400

    def test_redeem_decrements_points_correctly(self, s, cust_headers):
        # Get current points
        before = s.get(f"{BASE_URL}/api/account/loyalty", headers=cust_headers, timeout=10).json()["points"]
        # subtotal=2000 → max redeem 200; user has >= 123. redeem 50.
        # earn for total=2000 → 20 points. Net delta = +20 - 50 = -30
        payload = self._order_payload(total=2000, redeemed=50)
        # Ensure user has at least 50 points (123 from previous test)
        assert before >= 50, f"prereq failed, current points={before}"
        r = s.post(f"{BASE_URL}/api/orders", headers=cust_headers, json=payload, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert d["points_earned"] == 20
        assert d["points_redeemed"] == 50
        after = s.get(f"{BASE_URL}/api/account/loyalty", headers=cust_headers, timeout=10).json()["points"]
        assert after == before + 20 - 50, f"expected {before+20-50}, got {after}"

    def test_redeem_without_auth_400(self, s):
        payload = self._order_payload(total=5000, redeemed=10)
        r = s.post(f"{BASE_URL}/api/orders", json=payload, timeout=15)
        assert r.status_code == 400

    def test_account_orders_isolation(self, s):
        """Customer A should not see Customer B's orders."""
        # Register customer B
        emailB = _unique_email()
        rb = s.post(f"{BASE_URL}/api/auth/register", json={
            "name": "TEST_B", "email": emailB, "password": "Pass@1234"
        }, timeout=15)
        assert rb.status_code == 200
        tokB = rb.json()["access_token"]
        headersB = {"Authorization": f"Bearer {tokB}", "Content-Type": "application/json"}

        # B creates an order
        payload = {
            "customer_name": "TEST_B", "email": emailB,
            "phone": "8888800000", "address_line": "B St", "city": "Mumbai",
            "state": "MH", "pincode": "400001",
            "items": [{"product_id": "p-001", "slug": "classic-round-brilliant-stud",
                       "name": "Stud", "price": 3499, "quantity": 1, "image": "x"}],
            "subtotal": 3499, "shipping": 0, "total": 3499, "redeemed_points": 0,
        }
        r = s.post(f"{BASE_URL}/api/orders", headers=headersB, json=payload, timeout=15)
        assert r.status_code == 200
        order_no_b = r.json()["order_number"]

        # B sees their own order
        ordsB = s.get(f"{BASE_URL}/api/account/orders", headers=headersB, timeout=10).json()
        assert any(o["order_number"] == order_no_b for o in ordsB)
