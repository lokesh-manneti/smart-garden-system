"""
Seed Script: Populates the plant_catalog table with 75 Indian plants.
Usage: python seed_catalog.py
"""
import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("ERROR: DATABASE_URL not set in .env")
    sys.exit(1)

engine = create_engine(DATABASE_URL, connect_args={"sslmode": "require"})

# 75 Indian plants across 4 categories
PLANTS = [
    # ─── FLOWERS (20) ────────────────────────────────────────
    ("Marigold (Genda)", "Tagetes erecta", 2, "Full Sun",
     "https://images.unsplash.com/photo-1636886564430-a8a6e30e39e1?q=80&w=400"),
    ("Hibiscus (Jaswand)", "Hibiscus rosa-sinensis", 2, "Full Sun",
     "https://images.unsplash.com/photo-1597391771852-6e931e979a6d?q=80&w=400"),
    ("Jasmine (Mogra)", "Jasminum sambac", 3, "Partial Sun",
     "https://images.unsplash.com/photo-1588873281272-b64bf5a11e3d?q=80&w=400"),
    ("Rose (Gulab)", "Rosa indica", 2, "Full Sun",
     "https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=400"),
    ("Bougainvillea", "Bougainvillea spectabilis", 4, "Full Sun",
     "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=400"),
    ("Lotus (Kamal)", "Nelumbo nucifera", 1, "Full Sun",
     "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=400"),
    ("Plumeria (Champa)", "Plumeria rubra", 4, "Full Sun",
     "https://images.unsplash.com/photo-1621453825200-16e4ad6c6cdf?q=80&w=400"),
    ("Sunflower (Surajmukhi)", "Helianthus annuus", 2, "Full Sun",
     "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=400"),
    ("Dahlia", "Dahlia pinnata", 2, "Full Sun",
     "https://images.unsplash.com/photo-1625065981270-65e38d30a0ae?q=80&w=400"),
    ("Chrysanthemum (Gul-e-Daudi)", "Chrysanthemum indicum", 2, "Full Sun",
     "https://images.unsplash.com/photo-1567444268919-0aac3d11965f?q=80&w=400"),
    ("Rajnigandha (Tuberose)", "Polianthes tuberosa", 3, "Full Sun",
     "https://images.unsplash.com/photo-1590377830313-2e80f3b0b668?q=80&w=400"),
    ("Parijat (Night Jasmine)", "Nyctanthes arbor-tristis", 3, "Partial Sun",
     "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?q=80&w=400"),
    ("Zinnia", "Zinnia elegans", 2, "Full Sun",
     "https://images.unsplash.com/photo-1630320525498-5ed998c1dae4?q=80&w=400"),
    ("Ixora (Jungle Flame)", "Ixora coccinea", 3, "Full Sun",
     "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?q=80&w=400"),
    ("Periwinkle (Sadabahar)", "Catharanthus roseus", 3, "Full Sun",
     "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?q=80&w=400"),
    ("Petunia", "Petunia hybrida", 1, "Full Sun",
     "https://images.unsplash.com/photo-1606567595334-d39972c85dbe?q=80&w=400"),
    ("Crossandra (Kanakambaram)", "Crossandra infundibuliformis", 2, "Full Sun",
     "https://images.unsplash.com/photo-1597391253958-73c2f7e35be4?q=80&w=400"),
    ("Kaner (Oleander)", "Nerium oleander", 5, "Full Sun",
     "https://images.unsplash.com/photo-1592158369319-8e96ac2bba31?q=80&w=400"),
    ("Aparajita (Butterfly Pea)", "Clitoria ternatea", 2, "Full Sun",
     "https://images.unsplash.com/photo-1595516483419-b636dcc64e47?q=80&w=400"),
    ("Gomphrena (Globe Amaranth)", "Gomphrena globosa", 2, "Full Sun",
     "https://images.unsplash.com/photo-1567748157439-381ee38d6e9f?q=80&w=400"),

    # ─── VEGETABLES & HERBS (25) ─────────────────────────────
    ("Tulsi (Holy Basil)", "Ocimum tenuiflorum", 1, "Full Sun",
     "https://images.unsplash.com/photo-1629157029048-22575e0ceff4?q=80&w=400"),
    ("Curry Leaf (Kadi Patta)", "Murraya koenigii", 3, "Full Sun",
     "https://images.unsplash.com/photo-1638907048495-e65c58fa4427?q=80&w=400"),
    ("Green Chili (Hari Mirch)", "Capsicum annuum", 2, "Full Sun",
     "https://images.unsplash.com/photo-1588252303782-cb80be176243?q=80&w=400"),
    ("Coriander (Dhaniya)", "Coriandrum sativum", 1, "Partial Sun",
     "https://images.unsplash.com/photo-1595855759920-86582396756a?q=80&w=400"),
    ("Mint (Pudina)", "Mentha spicata", 1, "Partial Sun",
     "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?q=80&w=400"),
    ("Tomato (Tamatar)", "Solanum lycopersicum", 1, "Full Sun",
     "https://images.unsplash.com/photo-1592841200221-a62ac6328c90?q=80&w=400"),
    ("Fenugreek (Methi)", "Trigonella foenum-graecum", 1, "Full Sun",
     "https://images.unsplash.com/photo-1515586838455-8f8f940d6853?q=80&w=400"),
    ("Spinach (Palak)", "Spinacia oleracea", 1, "Partial Sun",
     "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=400"),
    ("Bitter Gourd (Karela)", "Momordica charantia", 2, "Full Sun",
     "https://images.unsplash.com/photo-1604184956434-e7b1a8903851?q=80&w=400"),
    ("Bottle Gourd (Lauki)", "Lagenaria siceraria", 2, "Full Sun",
     "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?q=80&w=400"),
    ("Okra (Bhindi)", "Abelmoschus esculentus", 1, "Full Sun",
     "https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=400"),
    ("Brinjal (Baingan)", "Solanum melongena", 2, "Full Sun",
     "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?q=80&w=400"),
    ("Drumstick (Moringa)", "Moringa oleifera", 5, "Full Sun",
     "https://images.unsplash.com/photo-1616485828923-2640d38aa06c?q=80&w=400"),
    ("Lemongrass", "Cymbopogon citratus", 3, "Full Sun",
     "https://images.unsplash.com/photo-1596547609652-9cf5d8c76921?q=80&w=400"),
    ("Rosemary", "Salvia rosmarinus", 4, "Full Sun",
     "https://images.unsplash.com/photo-1515586838455-8f8f940d8553?q=80&w=400"),
    ("Ajwain (Carom)", "Trachyspermum ammi", 2, "Full Sun",
     "https://images.unsplash.com/photo-1606567595334-d39972c85dbe?q=80&w=400"),
    ("Amaranth (Chaulai)", "Amaranthus tricolor", 1, "Full Sun",
     "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=400"),
    ("Ridge Gourd (Turai)", "Luffa acutangula", 2, "Full Sun",
     "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?q=80&w=400"),
    ("Pumpkin (Kaddu)", "Cucurbita moschata", 3, "Full Sun",
     "https://images.unsplash.com/photo-1506917728037-b6af01a7d403?q=80&w=400"),
    ("Radish (Mooli)", "Raphanus sativus", 1, "Partial Sun",
     "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=400"),
    ("Cluster Bean (Gawar)", "Cyamopsis tetragonoloba", 2, "Full Sun",
     "https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=400"),
    ("Onion (Pyaaz)", "Allium cepa", 3, "Full Sun",
     "https://images.unsplash.com/photo-1587049352847-81f56db88db4?q=80&w=400"),
    ("Garlic (Lehsun)", "Allium sativum", 4, "Full Sun",
     "https://images.unsplash.com/photo-1615477550927-6ec8445da4ed?q=80&w=400"),
    ("Turmeric (Haldi)", "Curcuma longa", 3, "Partial Sun",
     "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?q=80&w=400"),
    ("Ginger (Adrak)", "Zingiber officinale", 3, "Partial Sun",
     "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=400"),

    # ─── FRUITS (15) ─────────────────────────────────────────
    ("Mango Sapling (Aam)", "Mangifera indica", 3, "Full Sun",
     "https://images.unsplash.com/photo-1605027990121-cbae9e0642df?q=80&w=400"),
    ("Guava (Amrood)", "Psidium guajava", 3, "Full Sun",
     "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?q=80&w=400"),
    ("Papaya", "Carica papaya", 2, "Full Sun",
     "https://images.unsplash.com/photo-1617112848923-cc2234396a8d?q=80&w=400"),
    ("Banana (Kela)", "Musa acuminata", 2, "Full Sun",
     "https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=400"),
    ("Pomegranate (Anaar)", "Punica granatum", 4, "Full Sun",
     "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=400"),
    ("Lemon (Nimbu)", "Citrus limon", 3, "Full Sun",
     "https://images.unsplash.com/photo-1590502593747-42a996133562?q=80&w=400"),
    ("Custard Apple (Sitaphal)", "Annona squamosa", 4, "Full Sun",
     "https://images.unsplash.com/photo-1605027990121-cbae9e0642df?q=80&w=400"),
    ("Coconut Palm (Nariyal)", "Cocos nucifera", 5, "Full Sun",
     "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=400"),
    ("Amla (Indian Gooseberry)", "Phyllanthus emblica", 5, "Full Sun",
     "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=400"),
    ("Chikoo (Sapodilla)", "Manilkara zapota", 4, "Full Sun",
     "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=400"),
    ("Sweet Lime (Mosambi)", "Citrus limetta", 3, "Full Sun",
     "https://images.unsplash.com/photo-1590502593747-42a996133562?q=80&w=400"),
    ("Jamun (Java Plum)", "Syzygium cumini", 5, "Full Sun",
     "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=400"),
    ("Starfruit (Kamrakh)", "Averrhoa carambola", 3, "Full Sun",
     "https://images.unsplash.com/photo-1536858826726-717f7cb5cbc1?q=80&w=400"),
    ("Dragon Fruit", "Hylocereus undatus", 5, "Full Sun",
     "https://images.unsplash.com/photo-1527325678964-54921661f888?q=80&w=400"),
    ("Jackfruit (Kathal)", "Artocarpus heterophyllus", 5, "Full Sun",
     "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=400"),

    # ─── DECOR & INDOOR (15) ─────────────────────────────────
    ("Money Plant", "Epipremnum aureum", 5, "Low Light",
     "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=400"),
    ("Snake Plant", "Dracaena trifasciata", 10, "Low Light",
     "https://images.unsplash.com/photo-1593482892540-ac2b2ce8e4fc?q=80&w=400"),
    ("Aloe Vera", "Aloe barbadensis miller", 7, "Partial Sun",
     "https://images.unsplash.com/photo-1596547609652-9cf5d8c76921?q=80&w=400"),
    ("Peace Lily", "Spathiphyllum wallisii", 5, "Low Light",
     "https://images.unsplash.com/photo-1616690710400-a16d146927c5?q=80&w=400"),
    ("Areca Palm", "Dypsis lutescens", 3, "Partial Sun",
     "https://images.unsplash.com/photo-1610173826608-e2a1a0c569de?q=80&w=400"),
    ("Neem", "Azadirachta indica", 5, "Full Sun",
     "https://images.unsplash.com/photo-1636400695581-7add7bf9ad84?q=80&w=400"),
    ("Rubber Plant", "Ficus elastica", 7, "Partial Sun",
     "https://images.unsplash.com/photo-1609860426147-042a76502ba0?q=80&w=400"),
    ("Spider Plant", "Chlorophytum comosum", 5, "Partial Sun",
     "https://images.unsplash.com/photo-1572688484438-313a56e6dc34?q=80&w=400"),
    ("Jade Plant", "Crassula ovata", 10, "Partial Sun",
     "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?q=80&w=400"),
    ("ZZ Plant", "Zamioculcas zamiifolia", 14, "Low Light",
     "https://images.unsplash.com/photo-1632207691143-643e2a9a9361?q=80&w=400"),
    ("Bamboo Palm", "Chamaedorea seifrizii", 4, "Partial Sun",
     "https://images.unsplash.com/photo-1610173826608-e2a1a0c569de?q=80&w=400"),
    ("Pothos (Golden)", "Epipremnum aureum", 5, "Low Light",
     "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=400"),
    ("Boston Fern", "Nephrolepis exaltata", 2, "Partial Sun",
     "https://images.unsplash.com/photo-1585069395242-65d2a4d44758?q=80&w=400"),
    ("Fiddle Leaf Fig", "Ficus lyrata", 7, "Partial Sun",
     "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=400"),
    ("Croton", "Codiaeum variegatum", 3, "Full Sun",
     "https://images.unsplash.com/photo-1598880940080-ff9a29891b85?q=80&w=400"),
]

def seed():
    with engine.connect() as conn:
        # Clear existing data (cascade-safe order)
        conn.execute(text("DELETE FROM user_garden"))
        conn.execute(text("DELETE FROM plant_catalog"))
        conn.execute(text("ALTER SEQUENCE plant_catalog_id_seq RESTART WITH 1"))
        conn.commit()
        print(f"Cleared existing catalog. Inserting {len(PLANTS)} plants...")

        for name, species, water_freq, sunlight, image_url in PLANTS:
            conn.execute(
                text("""
                    INSERT INTO plant_catalog (name, species, water_frequency_days, sunlight_need, default_image_url)
                    VALUES (:name, :species, :water, :sun, :img)
                    ON CONFLICT (name) DO NOTHING
                """),
                {"name": name, "species": species, "water": water_freq, "sun": sunlight, "img": image_url}
            )
        conn.commit()
        
        result = conn.execute(text("SELECT COUNT(*) FROM plant_catalog"))
        count = result.scalar()
        print(f"SUCCESS: {count} plants seeded into plant_catalog!")

if __name__ == "__main__":
    seed()
