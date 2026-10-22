from pathlib import Path

DOMAIN = "car_insights"
DEFAULT_ADDON_URL = "http://local-car-insights:8099"
TOKEN_PATH = Path("/share/car_insights/internal_token")
CONF_DIR = Path("/share/car_insights")  # <vehicle_id>.conf lands here; contains the secret by design
MAX_BODY = 300 * 1024  # car batches are <= 256 KB
