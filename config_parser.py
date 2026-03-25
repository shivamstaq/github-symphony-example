"""Config parser with input validation."""

VALID_LOG_LEVELS = {"DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"}
VALID_ENVIRONMENTS = {"development", "staging", "production"}


class ConfigValidationError(ValueError):
    """Raised when a config value fails validation."""


def parse_config(config: dict) -> dict:
    """Parse and validate a configuration dictionary.

    Args:
        config: Raw configuration dictionary.

    Returns:
        Validated configuration dictionary.

    Raises:
        ConfigValidationError: If any config value is invalid.
    """
    if not isinstance(config, dict):
        raise ConfigValidationError(
            f"Config must be a dictionary, got {type(config).__name__}"
        )

    validated = {}

    # Validate 'host'
    if "host" in config:
        host = config["host"]
        if not isinstance(host, str) or not host.strip():
            raise ConfigValidationError(
                f"'host' must be a non-empty string, got {host!r}"
            )
        validated["host"] = host.strip()

    # Validate 'port'
    if "port" in config:
        port = config["port"]
        if not isinstance(port, int) or isinstance(port, bool):
            raise ConfigValidationError(
                f"'port' must be an integer, got {type(port).__name__}"
            )
        if not (1 <= port <= 65535):
            raise ConfigValidationError(
                f"'port' must be between 1 and 65535, got {port}"
            )
        validated["port"] = port

    # Validate 'log_level'
    if "log_level" in config:
        log_level = config["log_level"]
        if not isinstance(log_level, str):
            raise ConfigValidationError(
                f"'log_level' must be a string, got {type(log_level).__name__}"
            )
        log_level_upper = log_level.upper()
        if log_level_upper not in VALID_LOG_LEVELS:
            raise ConfigValidationError(
                f"'log_level' must be one of {sorted(VALID_LOG_LEVELS)}, got {log_level!r}"
            )
        validated["log_level"] = log_level_upper

    # Validate 'environment'
    if "environment" in config:
        environment = config["environment"]
        if not isinstance(environment, str):
            raise ConfigValidationError(
                f"'environment' must be a string, got {type(environment).__name__}"
            )
        if environment not in VALID_ENVIRONMENTS:
            raise ConfigValidationError(
                f"'environment' must be one of {sorted(VALID_ENVIRONMENTS)}, got {environment!r}"
            )
        validated["environment"] = environment

    # Validate 'max_connections'
    if "max_connections" in config:
        max_conn = config["max_connections"]
        if not isinstance(max_conn, int) or isinstance(max_conn, bool):
            raise ConfigValidationError(
                f"'max_connections' must be an integer, got {type(max_conn).__name__}"
            )
        if max_conn < 1:
            raise ConfigValidationError(
                f"'max_connections' must be at least 1, got {max_conn}"
            )
        validated["max_connections"] = max_conn

    # Pass through unknown keys without validation
    for key in config:
        if key not in validated:
            validated[key] = config[key]

    return validated
