from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    Uses .env file if present, otherwise uses environment variables.
    """
    
    # App settings
    environment: str = "development"
    debug: bool = False
    
    # Database
    database_url: str = "sqlite:///./taskflow.db"
    
    # Security
    secret_key: str = "clave_secreta_super_segura_para_desarrollo"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS
    allowed_origins: str = "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173"
    
    # Logging
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
    
    @property
    def allowed_origins_list(self) -> List[str]:
        """Convert comma-separated origins string to list"""
        return [origin.strip() for origin in self.allowed_origins.split(",")]
    
    @property
    def is_production(self) -> bool:
        """Check if running in production"""
        return self.environment.lower() == "production"


# Create global settings instance
settings = Settings()
