from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Application name used in API documentation
    app_name: str = "BuyBright"

    # PostgreSQL database connection URL (automatically mapped from DATABASE_URL in .env)
    database_url: str

    # Redis connection URL (automatically mapped from REDIS_URL in .env)
    redis_url: str

    # Cryptographic secret key used for signing JWT tokens (automatically mapped from SECRET_KEY in .env)
    secret_key: str

    # How long an authentication JWT access token remains valid in minutes
    access_token_expire_minutes: int = 60

    # Allowed origins for CORS as a comma-separated string (e.g. "http://localhost:5173")
    cors_origins: str = "http://localhost:5173"

    # Pydantic configuration: reads .env file and ignores any extra variables not defined above
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origins_list(self) -> list[str]:
        """Convert the comma-separated cors_origins string into a Python list of URL strings."""
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


# Global settings singleton instance loaded when the module is imported
settings = Settings()

