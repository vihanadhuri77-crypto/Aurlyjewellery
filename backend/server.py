from dotenv import load_dotenv
from pathlib import Path
load_dotenv(Path(__file__).parent / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import bcrypt
import jwt
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_ALGORITHM = "HS256"
JWT_EXPIRY_HOURS = 12

app = FastAPI(title="Cently API")
api_router = APIRouter(prefix="/api")
admin_router = APIRouter(prefix="/api/admin")

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ========== Auth helpers ==========
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRY_HOURS),
        "type": "access",
    }
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


async def get_current_admin(request: Request) -> dict:
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = auth_header[7:]
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# ========== Models ==========
class Product(BaseModel):
    id: str
    slug: str
    name: str
    category: str
    subcategory: Optional[str] = None
    price: int
    currency: str = "INR"
    images: List[str]
    description: str
    diamond_clarity: str = "VVS1/VVS2"
    diamond_colour: str = "E-F"
    metal: str = "Solid 9ct Gold · BIS Hallmarked"
    carat_weight: Optional[str] = None
    certification: str = "GIA / IGI / SGL Certified"
    badges: List[str] = []
    bestseller: bool = False
    stock: int = 25


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class NewsletterIn(BaseModel):
    email: EmailStr


class ContactIn(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    order_number: Optional[str] = None
    enquiry_type: str
    message: str


class ConsultationIn(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    consultation_type: str
    mode: str
    preferred_date: Optional[str] = None
    notes: Optional[str] = None


class OrderItem(BaseModel):
    product_id: str
    slug: str
    name: str
    price: int
    quantity: int
    image: str


class OrderIn(BaseModel):
    customer_name: str
    email: EmailStr
    phone: str
    address_line: str
    city: str
    state: str
    pincode: str
    items: List[OrderItem]
    subtotal: int
    shipping: int
    total: int


# ========== Sample Catalogue ==========
SAMPLE_PRODUCTS: List[dict] = [
    {"id": "p-001", "slug": "classic-round-brilliant-stud", "name": "Classic Round Brilliant Stud",
     "category": "studs", "price": 3499, "carat_weight": "0.08ct",
     "images": ["https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=900&auto=format&fit=crop"],
     "description": "The one she never takes off. A certified natural VVS diamond set in solid 9ct gold — the most personal piece of fine jewellery.",
     "badges": ["VVS1", "E Colour", "Bestseller"], "bestseller": True},
    {"id": "p-002", "slug": "princess-cut-stud", "name": "Princess Cut Stud",
     "category": "studs", "price": 4299, "carat_weight": "0.10ct",
     "images": ["https://images.unsplash.com/photo-1588444650700-6c46dc37bc91?w=900&auto=format&fit=crop"],
     "description": "Sharp, modern, and unapologetic. Princess cut VVS diamonds in solid 9ct gold — the everyday stud, redefined.",
     "badges": ["VVS2", "F Colour", "IGI Certified"]},
    {"id": "p-003", "slug": "halo-diamond-stud", "name": "Halo Diamond Stud",
     "category": "studs", "price": 6799, "carat_weight": "0.15ct",
     "images": ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=900&auto=format&fit=crop"],
     "description": "A central VVS diamond framed by a halo of smaller stones — brilliance amplified, crafted in solid 9ct gold.",
     "badges": ["VVS1", "E Colour", "GIA Certified", "New In"]},
    {"id": "p-101", "slug": "diamond-hoop", "name": "Diamond Hoop",
     "category": "earrings", "price": 8499, "carat_weight": "0.20ct total",
     "images": ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900&auto=format&fit=crop"],
     "description": "The hoop she puts in once and never takes out. Pavé-set VVS diamonds along a solid 9ct gold curve.",
     "badges": ["VVS1", "E Colour", "Bestseller"], "bestseller": True},
    {"id": "p-102", "slug": "diamond-huggie", "name": "Diamond Huggie",
     "category": "earrings", "price": 5999, "carat_weight": "0.12ct total",
     "images": ["https://images.unsplash.com/photo-1630019852942-f89202989a59?w=900&auto=format&fit=crop"],
     "description": "Close-set. Clean. Considered. A row of VVS diamonds hugging the lobe in solid 9ct gold.",
     "badges": ["VVS2", "F Colour"]},
    {"id": "p-103", "slug": "diamond-drop", "name": "Diamond Drop",
     "category": "earrings", "price": 12499, "carat_weight": "0.30ct total",
     "images": ["https://images.unsplash.com/photo-1630019852979-e8bfcb4b4a96?w=900&auto=format&fit=crop"],
     "description": "A thread of 9ct gold and VVS diamonds — movement, light, and a whisper of brilliance at the jawline.",
     "badges": ["VVS1", "E Colour", "GIA Certified"]},
    {"id": "p-201", "slug": "vvs-solitaire-ring", "name": "VVS Solitaire Ring",
     "category": "rings", "price": 24999, "carat_weight": "0.50ct",
     "images": ["https://images.pexels.com/photos/30541177/pexels-photo-30541177.jpeg?auto=compress&cs=tinysrgb&w=900"],
     "description": "The one ring. Certified natural VVS1 diamond, E colour, set in a classic six-prong solid 9ct gold setting.",
     "badges": ["VVS1", "E Colour", "GIA Certified", "Bestseller"], "bestseller": True},
    {"id": "p-202", "slug": "diamond-eternity-band", "name": "Diamond Eternity Band",
     "category": "rings", "price": 18499, "carat_weight": "0.75ct total",
     "images": ["https://images.unsplash.com/photo-1603561596112-db542a031cfa?w=900&auto=format&fit=crop"],
     "description": "A continuous circle of VVS diamonds with no beginning and no end. Solid 9ct gold. Named for what it means.",
     "badges": ["VVS2", "F Colour", "IGI Certified"]},
    {"id": "p-203", "slug": "stacking-band", "name": "Plain Gold Stacking Band",
     "category": "rings", "price": 5999,
     "images": ["https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=900&auto=format&fit=crop"],
     "description": "Wear one, wear three. A slim solid 9ct gold band designed to stack beautifully with every Cently ring.",
     "badges": ["BIS Hallmarked", "New In"]},
    {"id": "p-301", "slug": "solitaire-diamond-necklace", "name": "Solitaire Diamond Necklace",
     "category": "necklaces", "price": 9999, "carat_weight": "0.10ct",
     "images": ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&auto=format&fit=crop"],
     "description": "A single VVS diamond suspended on a fine solid 9ct gold chain. Everything. Nothing more.",
     "badges": ["VVS1", "E Colour", "Bestseller"], "bestseller": True},
    {"id": "p-302", "slug": "plain-gold-chain-necklace", "name": "Plain Gold Chain Necklace",
     "category": "necklaces", "price": 6499,
     "images": ["https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&auto=format&fit=crop"],
     "description": "The chain she layers, loans, and never quite parts with. Solid 9ct gold, BIS Hallmarked. Made to outlast trends.",
     "badges": ["BIS Hallmarked"]},
    {"id": "p-303", "slug": "dainty-diamond-station", "name": "Dainty Diamond Station Necklace",
     "category": "necklaces", "price": 11999, "carat_weight": "0.25ct total",
     "images": ["https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=900&auto=format&fit=crop"],
     "description": "Small VVS diamonds punctuating a fine 9ct gold chain — a subtle glint across the collarbone.",
     "badges": ["VVS2", "F Colour", "New In"]},
    {"id": "p-401", "slug": "vvs-tennis-bracelet", "name": "VVS Diamond Tennis Bracelet",
     "category": "bracelets", "price": 38999, "carat_weight": "3.00ct total",
     "images": ["https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=900&auto=format&fit=crop"],
     "description": "The most considered wrist piece in fine jewellery. 3ct of VVS diamonds — one grade, one standard — in solid 9ct gold.",
     "badges": ["VVS1", "E Colour", "GIA Certified", "Bestseller"], "bestseller": True},
    {"id": "p-402", "slug": "gold-cuff", "name": "Solid Gold Cuff",
     "category": "bracelets", "price": 14999,
     "images": ["https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=900&auto=format&fit=crop"],
     "description": "Sculptural. Substantial. Solid 9ct gold at its most architectural — BIS Hallmarked, built to last generations.",
     "badges": ["BIS Hallmarked", "New In"]},
    {"id": "p-501", "slug": "classic-diamond-locket", "name": "Classic Diamond Locket",
     "category": "lockets", "price": 7999, "carat_weight": "0.08ct",
     "images": ["https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=900&auto=format&fit=crop"],
     "description": "The piece worn closest to the heart. A VVS diamond accent on a solid 9ct gold locket — engravable.",
     "badges": ["VVS2", "F Colour", "Engravable"]},
    {"id": "p-601", "slug": "bridal-engagement-ring", "name": "Bridal Engagement Ring",
     "category": "bridal", "price": 45999, "carat_weight": "1.00ct",
     "images": ["https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=900&auto=format&fit=crop"],
     "description": "The ring she says yes to — and yes to, every morning after. 1ct VVS1 solitaire, E colour, solid 9ct gold.",
     "badges": ["VVS1", "E Colour", "GIA Certified", "Bestseller"], "bestseller": True},
    {"id": "p-602", "slug": "modern-mangalsutra", "name": "The Modern Mangalsutra",
     "category": "bridal", "price": 28499, "carat_weight": "0.45ct total",
     "images": ["https://images.unsplash.com/photo-1630019852895-5a3f39e6e6b5?w=900&auto=format&fit=crop"],
     "description": "Tradition, reimagined. Solid 9ct gold with VVS diamond accents — as fine as everything else she wears.",
     "badges": ["VVS2", "F Colour", "IGI Certified"]},
    {"id": "p-701", "slug": "diamond-nose-pin", "name": "Diamond Nose Pin",
     "category": "accessories", "price": 2499, "carat_weight": "0.05ct",
     "images": ["https://images.unsplash.com/photo-1603974372039-adc49044b6bd?w=900&auto=format&fit=crop"],
     "description": "Small. Certified. Unapologetically real. A VVS diamond nose pin in solid 9ct gold — from ₹2,499.",
     "badges": ["VVS2", "F Colour"]},
    {"id": "p-702", "slug": "gold-anklet", "name": "Solid Gold Anklet",
     "category": "accessories", "price": 8999,
     "images": ["https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=900&auto=format&fit=crop"],
     "description": "A delicate solid 9ct gold anklet — BIS Hallmarked, weightless, and built to be worn every day.",
     "badges": ["BIS Hallmarked"]},
]


async def seed_products():
    if await db.products.count_documents({}) == 0:
        for p in SAMPLE_PRODUCTS:
            doc = Product(**p).model_dump()
            await db.products.insert_one(doc)
        logger.info(f"Seeded {len(SAMPLE_PRODUCTS)} products")


async def seed_admin():
    admin_email = os.environ["ADMIN_EMAIL"].lower()
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Cently Admin",
            "role": "admin",
            "created_at": now_iso(),
        })
        logger.info("Admin seeded")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}}
        )
        logger.info("Admin password updated")


# ========== Public Routes ==========
@api_router.get("/")
async def root():
    return {"message": "Cently API live", "brand": "CENTLY"}


@api_router.get("/products", response_model=List[Product])
async def list_products(category: Optional[str] = None, bestseller: Optional[bool] = None, limit: int = 100):
    q = {}
    if category:
        q["category"] = category
    if bestseller is not None:
        q["bestseller"] = bestseller
    docs = await db.products.find(q, {"_id": 0}).limit(limit).to_list(limit)
    return docs


@api_router.get("/products/{slug}", response_model=Product)
async def get_product(slug: str):
    doc = await db.products.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    return doc


@api_router.get("/categories")
async def list_categories():
    return [
        {"slug": "studs", "name": "Studs", "tagline": "The one she never takes off."},
        {"slug": "earrings", "name": "Earrings", "tagline": "Every silhouette. One standard throughout."},
        {"slug": "rings", "name": "Rings", "tagline": "For every finger. For every meaning."},
        {"slug": "lockets", "name": "Lockets", "tagline": "Worn closest to the heart."},
        {"slug": "necklaces", "name": "Necklaces", "tagline": "Sits closest to the collarbone. Always noticed."},
        {"slug": "bracelets", "name": "Bracelets", "tagline": "Always on her wrist."},
        {"slug": "accessories", "name": "Accessories", "tagline": "Every piece. The same standard."},
        {"slug": "bridal", "name": "Bridal", "tagline": "Real Gold. Real Diamonds. For every moment after."},
    ]


@api_router.post("/newsletter")
async def subscribe_newsletter(payload: NewsletterIn):
    doc = {"id": str(uuid.uuid4()), "email": payload.email, "created_at": now_iso()}
    await db.newsletter.update_one({"email": payload.email}, {"$setOnInsert": doc}, upsert=True)
    return {"success": True, "message": "Welcome to Cently. Your 10% off has been reserved.", "discount_code": "CENTLY10"}


@api_router.post("/contact")
async def submit_contact(payload: ContactIn):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = now_iso()
    await db.contact_messages.insert_one(doc)
    return {"success": True, "message": "Message received. We will reply personally, usually within a few hours."}


@api_router.post("/consultation")
async def book_consultation(payload: ConsultationIn):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = now_iso()
    doc["status"] = "pending"
    await db.consultations.insert_one(doc)
    return {"success": True, "message": "Consultation request received. Our team will confirm within one business day."}


@api_router.post("/orders")
async def create_order(payload: OrderIn):
    order_number = f"CNT-{uuid.uuid4().hex[:8].upper()}"
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["order_number"] = order_number
    doc["status"] = "pending_payment"
    doc["payment_provider"] = "razorpay_placeholder"
    doc["created_at"] = now_iso()
    await db.orders.insert_one(doc)
    return {
        "success": True,
        "order_number": order_number,
        "amount": payload.total,
        "currency": "INR",
        "razorpay_order_id": f"order_mock_{uuid.uuid4().hex[:12]}",
        "message": "Order created. Razorpay checkout would launch here.",
    }


@api_router.get("/journal")
async def list_journal():
    return [
        {"slug": "what-vvs-clarity-really-means", "title": "What VVS Clarity Really Means",
         "excerpt": "Near-flawless, by any measure. A close look at what it actually takes for a diamond to earn the VVS grade.",
         "image": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&auto=format&fit=crop",
         "date": "Feb 2026", "read_time": "6 min read"},
        {"slug": "choose-your-first-diamond-ring", "title": "How to Choose Your First Diamond Ring",
         "excerpt": "Carat, cut, clarity, colour — and the one thing most people miss. A first-time buyer's guide.",
         "image": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&auto=format&fit=crop",
         "date": "Jan 2026", "read_time": "8 min read"},
        {"slug": "stacking-gold-rings", "title": "The Complete Guide to Stacking Gold Rings",
         "excerpt": "One band, three, five — how to build a stack that looks collected, not curated.",
         "image": "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=1200&auto=format&fit=crop",
         "date": "Jan 2026", "read_time": "5 min read"},
        {"slug": "why-e-f-colour-diamonds", "title": "Why We Only Use E–F Colour Diamonds",
         "excerpt": "The difference between E and G is nearly invisible on paper — and completely visible on the hand.",
         "image": "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200&auto=format&fit=crop",
         "date": "Dec 2025", "read_time": "7 min read"},
    ]


# ========== Auth Routes ==========
@api_router.post("/auth/login")
async def login(payload: LoginIn):
    email = payload.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], email, user.get("role", "admin"))
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user["id"], "email": email, "name": user.get("name"), "role": user.get("role", "admin")},
    }


@api_router.get("/auth/me")
async def get_me(current: dict = Depends(get_current_admin)):
    return current


# ========== Admin Routes (protected) ==========
@admin_router.get("/stats")
async def admin_stats(current: dict = Depends(get_current_admin)):
    return {
        "products": await db.products.count_documents({}),
        "orders": await db.orders.count_documents({}),
        "newsletter_subscribers": await db.newsletter.count_documents({}),
        "contact_messages": await db.contact_messages.count_documents({}),
        "consultations": await db.consultations.count_documents({}),
    }


@admin_router.get("/orders")
async def admin_orders(current: dict = Depends(get_current_admin), limit: int = 200):
    docs = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    return docs


@admin_router.get("/newsletter")
async def admin_newsletter(current: dict = Depends(get_current_admin), limit: int = 500):
    docs = await db.newsletter.find({}, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    return docs


@admin_router.get("/contact")
async def admin_contact(current: dict = Depends(get_current_admin), limit: int = 200):
    docs = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    return docs


@admin_router.get("/consultations")
async def admin_consultations(current: dict = Depends(get_current_admin), limit: int = 200):
    docs = await db.consultations.find({}, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    return docs


@admin_router.get("/products")
async def admin_products(current: dict = Depends(get_current_admin)):
    docs = await db.products.find({}, {"_id": 0}).to_list(1000)
    return docs


app.include_router(api_router)
app.include_router(admin_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await seed_products()
    await seed_admin()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
