from app.core.database import SessionLocal
from app.models import Setting

DEFAULTS = [
    ("store_name", "BuyBright", "string", "Name shown in the storefront"),
    ("commission_percent", "5.00", "decimal", "Platform commission % per seller order"),
    ("delivery_fee", "40.00", "decimal", "Delivery fee per seller order (INR)"),
    ("points_per_100", "1", "int", "Points earned per 100 INR spent"),
    ("point_value", "1.00", "decimal", "INR value of one point when redeemed"),
    ("points_redeem_cap_percent", "20", "int", "Max % of an order payable with points"),
    ("low_stock_threshold", "5", "int", "Stock level that triggers a low-stock alert"),
]


def seed() -> None:
    with SessionLocal() as db:
        for key, value, value_type, description in DEFAULTS:
            if db.get(Setting, key) is None:  # never overwrite an admin's edit
                db.add(Setting(key=key, value=value,
                               value_type=value_type, description=description))
        db.commit()
    print("Settings seeded.")


if __name__ == "__main__":
    seed()

