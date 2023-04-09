import json
import os

from pydantic import BaseSettings


class Config(BaseSettings):
    class Config:
        env_file_encoding = "utf-8"

        @classmethod
        def customise_sources(
            cls,
            init_settings,
            env_settings,
            file_secret_settings,
        ):
            return (
                init_settings,
                env_settings,
                file_secret_settings,
            )

    model_path: str
    solr_url: str

# Lazily initialize the config variable using module-level __getattr__
# so that we can import the Config class without triggering config load.
_config = None


def __getattr__(name):
    if name == "config":
        global _config
        if _config is None:
            _config = load_config()
        return _config
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")


def load_config():
    env_file = os.getenv("ENV_FILE", ".env")
    return Config(_env_file=env_file)
