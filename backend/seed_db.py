from app.database import SessionLocal
from app.models import PlantCatalog

# 50 Popular Indian Garden Plants
INITIAL_PLANTS = [
    # Sacred & Medicinal
    {"name": "Holy Basil (Tulsi)", "species": "Ocimum tenuiflorum", "water_frequency_days": 1, "sunlight_need": "Full Sun"},
    {"name": "Curry Leaf (Kadi Patta)", "species": "Murraya koenigii", "water_frequency_days": 2, "sunlight_need": "Full Sun"},
    {"name": "Aloe Vera (Ghritkumari)", "species": "Aloe barbadensis miller", "water_frequency_days": 14, "sunlight_need": "Bright Direct"},
    {"name": "Ashwagandha", "species": "Withania somnifera", "water_frequency_days": 3, "sunlight_need": "Full Sun"},
    {"name": "Neem (Sapling)", "species": "Azadirachta indica", "water_frequency_days": 4, "sunlight_need": "Full Sun"},
    {"name": "Lemongrass", "species": "Cymbopogon", "water_frequency_days": 2, "sunlight_need": "Full Sun"},
    {"name": "Mint (Pudina)", "species": "Mentha", "water_frequency_days": 2, "sunlight_need": "Partial to Full Sun"},
    {"name": "Coriander (Dhania)", "species": "Coriandrum sativum", "water_frequency_days": 2, "sunlight_need": "Partial Sun"},
    {"name": "Indian Pennywort (Brahmi)", "species": "Centella asiatica", "water_frequency_days": 1, "sunlight_need": "Partial Sun"},
    {"name": "Malabar Nut (Adulsa)", "species": "Justicia adhatoda", "water_frequency_days": 3, "sunlight_need": "Partial Sun"},

    # Flowers
    {"name": "Jasmine (Mogra)", "species": "Jasminum sambac", "water_frequency_days": 2, "sunlight_need": "Full Sun"},
    {"name": "Marigold (Genda)", "species": "Tagetes", "water_frequency_days": 2, "sunlight_need": "Full Sun"},
    {"name": "Hibiscus (Gudhal)", "species": "Hibiscus rosa-sinensis", "water_frequency_days": 2, "sunlight_need": "Full Sun"},
    {"name": "Rose (Gulab)", "species": "Rosa", "water_frequency_days": 2, "sunlight_need": "Full Sun"},
    {"name": "Bougainvillea", "species": "Bougainvillea glabra", "water_frequency_days": 7, "sunlight_need": "Full Sun"},
    {"name": "Plumeria (Champa)", "species": "Plumeria rubra", "water_frequency_days": 5, "sunlight_need": "Full Sun"},
    {"name": "Night-Blooming Jasmine (Raat Ki Rani)", "species": "Cestrum nocturnum", "water_frequency_days": 2, "sunlight_need": "Partial Sun"},
    {"name": "Lotus (Kamal)", "species": "Nelumbo nucifera", "water_frequency_days": 1, "sunlight_need": "Full Sun"},
    {"name": "Periwinkle (Sadabahar)", "species": "Catharanthus roseus", "water_frequency_days": 3, "sunlight_need": "Full Sun"},
    {"name": "Chrysanthemum (Sevanti)", "species": "Chrysanthemum indicum", "water_frequency_days": 2, "sunlight_need": "Partial Sun"},
    {"name": "Tuberose (Rajnigandha)", "species": "Polianthes tuberosa", "water_frequency_days": 3, "sunlight_need": "Full Sun"},
    {"name": "Crossandra (Kanakambaram)", "species": "Crossandra infundibuliformis", "water_frequency_days": 2, "sunlight_need": "Partial Sun"},
    {"name": "Sunflower", "species": "Helianthus annuus", "water_frequency_days": 2, "sunlight_need": "Full Sun"},
    {"name": "Balsam (Gul Mehndi)", "species": "Impatiens balsamina", "water_frequency_days": 2, "sunlight_need": "Partial Sun"},

    # Vegetables & Fruits
    {"name": "Tomato (Tamatar)", "species": "Solanum lycopersicum", "water_frequency_days": 2, "sunlight_need": "Full Sun"},
    {"name": "Green Chilli (Hari Mirch)", "species": "Capsicum annuum", "water_frequency_days": 2, "sunlight_need": "Full Sun"},
    {"name": "Eggplant (Baingan)", "species": "Solanum melongena", "water_frequency_days": 2, "sunlight_need": "Full Sun"},
    {"name": "Okra (Bhindi)", "species": "Abelmoschus esculentus", "water_frequency_days": 2, "sunlight_need": "Full Sun"},
    {"name": "Bitter Gourd (Karela)", "species": "Momordica charantia", "water_frequency_days": 2, "sunlight_need": "Full Sun"},
    {"name": "Bottle Gourd (Lauki)", "species": "Lagenaria siceraria", "water_frequency_days": 2, "sunlight_need": "Full Sun"},
    {"name": "Spinach (Palak)", "species": "Spinacia oleracea", "water_frequency_days": 2, "sunlight_need": "Partial Sun"},
    {"name": "Fenugreek (Methi)", "species": "Trigonella foenum-graecum", "water_frequency_days": 2, "sunlight_need": "Full Sun"},
    {"name": "Lemon (Nimbu)", "species": "Citrus limon", "water_frequency_days": 4, "sunlight_need": "Full Sun"},
    {"name": "Papaya (Papeeta)", "species": "Carica papaya", "water_frequency_days": 3, "sunlight_need": "Full Sun"},
    {"name": "Pomegranate (Anar)", "species": "Punica granatum", "water_frequency_days": 5, "sunlight_need": "Full Sun"},
    {"name": "Guava (Amrood)", "species": "Psidium guajava", "water_frequency_days": 4, "sunlight_need": "Full Sun"},
    {"name": "Mango Sapling (Aam)", "species": "Mangifera indica", "water_frequency_days": 5, "sunlight_need": "Full Sun"},
    {"name": "Radish (Mooli)", "species": "Raphanus sativus", "water_frequency_days": 2, "sunlight_need": "Full Sun"},
    {"name": "Malabar Spinach (Basale)", "species": "Basella alba", "water_frequency_days": 2, "sunlight_need": "Partial Sun"},

    # Indoor & Foliage
    {"name": "Money Plant", "species": "Epipremnum aureum", "water_frequency_days": 7, "sunlight_need": "Moderate Indirect"},
    {"name": "Snake Plant", "species": "Sansevieria trifasciata", "water_frequency_days": 14, "sunlight_need": "Low to Bright Indirect"},
    {"name": "Areca Palm", "species": "Dypsis lutescens", "water_frequency_days": 5, "sunlight_need": "Bright Indirect"},
    {"name": "Rubber Plant", "species": "Ficus elastica", "water_frequency_days": 7, "sunlight_need": "Bright Indirect"},
    {"name": "Spider Plant", "species": "Chlorophytum comosum", "water_frequency_days": 7, "sunlight_need": "Bright Indirect"},
    {"name": "ZZ Plant", "species": "Zamioculcas zamiifolia", "water_frequency_days": 21, "sunlight_need": "Low Indirect"},
    {"name": "Croton", "species": "Codiaeum variegatum", "water_frequency_days": 4, "sunlight_need": "Bright Direct to Indirect"},
    {"name": "Syngonium (Arrowhead)", "species": "Syngonium podophyllum", "water_frequency_days": 5, "sunlight_need": "Bright Indirect"},
    {"name": "Fern", "species": "Tracheophyta", "water_frequency_days": 3, "sunlight_need": "Low to Medium Indirect"},
    {"name": "Aglaonema (Chinese Evergreen)", "species": "Aglaonema commutatum", "water_frequency_days": 7, "sunlight_need": "Low Indirect"},
    {"name": "Wandering Jew", "species": "Tradescantia zebrina", "water_frequency_days": 5, "sunlight_need": "Bright Indirect"}
]

def seed_data():
    db = SessionLocal()
    try:
        existing_count = db.query(PlantCatalog).count()
        if existing_count == 0:
            print("Database is empty. Populating Indian plant catalog...")
            for plant_data in INITIAL_PLANTS:
                new_plant = PlantCatalog(**plant_data)
                db.add(new_plant)
            
            db.commit()
            print(f"Successfully added {len(INITIAL_PLANTS)} plants to the catalog!")
        else:
            print(f"Catalog already contains {existing_count} plants. To re-seed, drop the table or delete rows first.")
    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()