"""Tests for config_parser input validation."""

import pytest
from config_parser import ConfigValidationError, parse_config


class TestParseConfigBasic:
    def test_valid_full_config(self):
        config = {
            "host": "localhost",
            "port": 8080,
            "log_level": "INFO",
            "environment": "production",
            "max_connections": 10,
        }
        result = parse_config(config)
        assert result["host"] == "localhost"
        assert result["port"] == 8080
        assert result["log_level"] == "INFO"
        assert result["environment"] == "production"
        assert result["max_connections"] == 10

    def test_empty_config(self):
        assert parse_config({}) == {}

    def test_non_dict_raises(self):
        with pytest.raises(ConfigValidationError, match="must be a dictionary"):
            parse_config("not a dict")

    def test_unknown_keys_passed_through(self):
        result = parse_config({"custom_key": "value"})
        assert result["custom_key"] == "value"


class TestHostValidation:
    def test_valid_host(self):
        result = parse_config({"host": "  example.com  "})
        assert result["host"] == "example.com"

    def test_empty_host_raises(self):
        with pytest.raises(ConfigValidationError, match="'host' must be a non-empty string"):
            parse_config({"host": ""})

    def test_whitespace_only_host_raises(self):
        with pytest.raises(ConfigValidationError, match="'host' must be a non-empty string"):
            parse_config({"host": "   "})

    def test_non_string_host_raises(self):
        with pytest.raises(ConfigValidationError, match="'host' must be a non-empty string"):
            parse_config({"host": 123})


class TestPortValidation:
    def test_valid_port(self):
        assert parse_config({"port": 443})["port"] == 443

    def test_min_port(self):
        assert parse_config({"port": 1})["port"] == 1

    def test_max_port(self):
        assert parse_config({"port": 65535})["port"] == 65535

    def test_zero_port_raises(self):
        with pytest.raises(ConfigValidationError, match="between 1 and 65535"):
            parse_config({"port": 0})

    def test_negative_port_raises(self):
        with pytest.raises(ConfigValidationError, match="between 1 and 65535"):
            parse_config({"port": -1})

    def test_too_large_port_raises(self):
        with pytest.raises(ConfigValidationError, match="between 1 and 65535"):
            parse_config({"port": 65536})

    def test_string_port_raises(self):
        with pytest.raises(ConfigValidationError, match="'port' must be an integer"):
            parse_config({"port": "8080"})

    def test_bool_port_raises(self):
        with pytest.raises(ConfigValidationError, match="'port' must be an integer"):
            parse_config({"port": True})


class TestLogLevelValidation:
    def test_valid_log_levels(self):
        for level in ("DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"):
            assert parse_config({"log_level": level})["log_level"] == level

    def test_case_insensitive(self):
        assert parse_config({"log_level": "debug"})["log_level"] == "DEBUG"
        assert parse_config({"log_level": "Warning"})["log_level"] == "WARNING"

    def test_invalid_log_level_raises(self):
        with pytest.raises(ConfigValidationError, match="'log_level' must be one of"):
            parse_config({"log_level": "VERBOSE"})

    def test_non_string_log_level_raises(self):
        with pytest.raises(ConfigValidationError, match="'log_level' must be a string"):
            parse_config({"log_level": 1})


class TestEnvironmentValidation:
    def test_valid_environments(self):
        for env in ("development", "staging", "production"):
            assert parse_config({"environment": env})["environment"] == env

    def test_invalid_environment_raises(self):
        with pytest.raises(ConfigValidationError, match="'environment' must be one of"):
            parse_config({"environment": "local"})

    def test_non_string_environment_raises(self):
        with pytest.raises(ConfigValidationError, match="'environment' must be a string"):
            parse_config({"environment": 42})


class TestMaxConnectionsValidation:
    def test_valid_max_connections(self):
        assert parse_config({"max_connections": 100})["max_connections"] == 100

    def test_zero_raises(self):
        with pytest.raises(ConfigValidationError, match="at least 1"):
            parse_config({"max_connections": 0})

    def test_negative_raises(self):
        with pytest.raises(ConfigValidationError, match="at least 1"):
            parse_config({"max_connections": -5})

    def test_non_int_raises(self):
        with pytest.raises(ConfigValidationError, match="must be an integer"):
            parse_config({"max_connections": "10"})

    def test_bool_raises(self):
        with pytest.raises(ConfigValidationError, match="must be an integer"):
            parse_config({"max_connections": True})
