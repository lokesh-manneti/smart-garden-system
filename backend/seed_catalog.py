"""
Smart Garden System — Plant Catalog Seed Script
================================================
Seeds the plant_catalog table with 25 diverse, realistic plants.
All image URLs use permanent Unsplash source links (400×400 crop).

Usage:
    python seed_catalog.py

Categories covered:
    - Indoor Tropicals (10)
    - Succulents & Cacti (3)
    - Flowering Indoor (2)
    - Herbs (5)
    - Outdoor Garden (5)
"""

import os
from sqlalchemy import text
from dotenv import load_dotenv
from app.database import engine

load_dotenv()

PLANTS = [
    # ── Indoor Tropicals ──────────────────────────────────────────
    {
        "name": "Monstera Deliciosa",
        "species": "Monstera deliciosa",
        "water_frequency_days": 7,
        "sunlight_need": "Indirect",
        "default_image_url": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=400&fit=crop&crop=center",
    },
    {
        "name": "Snake Plant",
        "species": "Dracaena trifasciata",
        "water_frequency_days": 14,
        "sunlight_need": "Low",
        "default_image_url": "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400&h=400&fit=crop&crop=center",
    },
    {
        "name": "Peace Lily",
        "species": "Spathiphyllum wallisii",
        "water_frequency_days": 5,
        "sunlight_need": "Low",
        "default_image_url": "https://images.unsplash.com/photo-1616694547468-e97afe50bd54?w=400&h=400&fit=crop&crop=center",
    },
    {
        "name": "Pothos",
        "species": "Epipremnum aureum",
        "water_frequency_days": 7,
        "sunlight_need": "Low",
        "default_image_url": "https://images.unsplash.com/photo-1572688840880-1e0e6f18b0e9?w=400&h=400&fit=crop&crop=center",
    },
    {
        "name": "Fiddle Leaf Fig",
        "species": "Ficus lyrata",
        "water_frequency_days": 7,
        "sunlight_need": "Indirect",
        "default_image_url": "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=400&fit=crop&crop=center",
    },
    {
        "name": "Rubber Plant",
        "species": "Ficus elastica",
        "water_frequency_days": 10,
        "sunlight_need": "Indirect",
        "default_image_url": "https://images.unsplash.com/photo-1509937528035-ad76f8df3291?w=400&h=400&fit=crop&crop=center",
    },
    {
        "name": "ZZ Plant",
        "species": "Zamioculcas zamiifolia",
        "water_frequency_days": 14,
        "sunlight_need": "Low",
        "default_image_url": "https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=400&h=400&fit=crop&crop=center",
    },
    {
        "name": "Spider Plant",
        "species": "Chlorophytum comosum",
        "water_frequency_days": 7,
        "sunlight_need": "Indirect",
        "default_image_url": "https://images.unsplash.com/photo-1572969176406-e4cf72483c29?w=400&h=400&fit=crop&crop=center",
    },
    {
        "name": "Boston Fern",
        "species": "Nephrolepis exaltata",
        "water_frequency_days": 3,
        "sunlight_need": "Indirect",
        "default_image_url": "https://images.unsplash.com/photo-1525498128493-380d1990a112?w=400&h=400&fit=crop&crop=center",
    },
    {
        "name": "Aloe Vera",
        "species": "Aloe barbadensis miller",
        "water_frequency_days": 14,
        "sunlight_need": "Full Sun",
        "default_image_url": "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400&h=400&fit=crop&crop=center",
    },
    # ── Succulents & Cacti ────────────────────────────────────────
    {
        "name": "Jade Plant",
        "species": "Crassula ovata",
        "water_frequency_days": 12,
        "sunlight_need": "Full Sun",
        "default_image_url": "https://images.unsplash.com/photo-1509937528035-ad76f8df3291?w=400&h=400&fit=crop&crop=center",
    },
    {
        "name": "Echeveria",
        "species": "Echeveria elegans",
        "water_frequency_days": 10,
        "sunlight_need": "Full Sun",
        "default_image_url": "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=400&fit=crop&crop=center",
    },
    {
        "name": "Barrel Cactus",
        "species": "Ferocactus wislizeni",
        "water_frequency_days": 21,
        "sunlight_need": "Full Sun",
        "default_image_url": "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=400&fit=crop&crop=center",
    },
    # ── Flowering Indoor ──────────────────────────────────────────
    {
        "name": "Orchid",
        "species": "Phalaenopsis amabilis",
        "water_frequency_days": 7,
        "sunlight_need": "Indirect",
        "default_image_url": "https://images.unsplash.com/photo-1566907225470-af88b2e5f68b?w=400&h=400&fit=crop&crop=center",
    },
    {
        "name": "African Violet",
        "species": "Saintpaulia ionantha",
        "water_frequency_days": 5,
        "sunlight_need": "Indirect",
        "default_image_url": "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=400&h=400&fit=crop&crop=center",
    },
    # ── Herbs ─────────────────────────────────────────────────────
    {
        "name": "Basil",
        "species": "Ocimum basilicum",
        "water_frequency_days": 2,
        "sunlight_need": "Full Sun",
        "default_image_url": "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&h=400&fit=crop&crop=center",
    },
    {
        "name": "Mint",
        "species": "Mentha spicata",
        "water_frequency_days": 2,
        "sunlight_need": "Partial Sun",
        "default_image_url": "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400&h=400&fit=crop&crop=center",
    },
    {
        "name": "Rosemary",
        "species": "Salvia rosmarinus",
        "water_frequency_days": 5,
        "sunlight_need": "Full Sun",
        "default_image_url": "https://images.unsplash.com/photo-1515586000433-45406d8e6662?w=400&h=400&fit=crop&crop=center",
    },
    {
        "name": "Cilantro",
        "species": "Coriandrum sativum",
        "water_frequency_days": 2,
        "sunlight_need": "Partial Sun",
        "default_image_url": "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&h=400&fit=crop&crop=center",
    },
    {
        "name": "Thyme",
        "species": "Thymus vulgaris",
        "water_frequency_days": 5,
        "sunlight_need": "Full Sun",
        "default_image_url": "https://images.unsplash.com/photo-1515586000433-45406d8e6662?w=400&h=400&fit=crop&crop=center",
    },
    # ── Outdoor Garden ────────────────────────────────────────────
    {
        "name": "Tomato",
        "species": "Solanum lycopersicum",
        "water_frequency_days": 2,
        "sunlight_need": "Full Sun",
        "default_image_url": "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=400&fit=crop&crop=center",
    },
    {
        "name": "Sunflower",
        "species": "Helianthus annuus",
        "water_frequency_days": 3,
        "sunlight_need": "Full Sun",
        "default_image_url": "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&h=400&fit=crop&crop=center",
    },
    {
        "name": "Lavender",
        "species": "Lavandula angustifolia",
        "water_frequency_days": 7,
        "sunlight_need": "Full Sun",
        "default_image_url": "https://images.unsplash.com/photo-1611909023032-2d6b3134ecba?w=400&h=400&fit=crop&crop=center",
    },
    {
        "name": "Rose",
        "species": "Rosa damascena",
        "water_frequency_days": 3,
        "sunlight_need": "Full Sun",
        "default_image_url": "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=400&h=400&fit=crop&crop=center",
    },
    {
        "name": "Marigold",
        "species": "Tagetes erecta",
        "water_frequency_days": 3,
        "sunlight_need": "Full Sun",
        "default_image_url": "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&h=400&fit=crop&crop=center",
    },
]


def seed():
    """Truncate and re-seed the plant_catalog table."""
    with engine.begin() as conn:
        # Wipe dependents first, then catalog
        conn.execute(text("TRUNCATE TABLE public.user_garden CASCADE"))
        conn.execute(text("TRUNCATE TABLE public.plant_catalog CASCADE"))
        conn.execute(text("ALTER SEQUENCE plant_catalog_id_seq RESTART WITH 1"))

        for plant in PLANTS:
            conn.execute(
                text(
                    """
                    INSERT INTO plant_catalog (name, species, water_frequency_days, sunlight_need, default_image_url)
                    VALUES (:name, :species, :water_frequency_days, :sunlight_need, :default_image_url)
                    """
                ),
                plant,
            )

    print(f"✅ Successfully seeded {len(PLANTS)} plants into plant_catalog.")


if __name__ == "__main__":
    seed()
