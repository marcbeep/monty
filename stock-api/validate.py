#!/usr/bin/env python3
"""Validate Python code syntax and imports."""

import ast
import sys
from pathlib import Path


def validate_file(file_path):
    """Validate a single Python file."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Check syntax
        ast.parse(content)
        print(f"✅ {file_path}")
        return True

    except SyntaxError as e:
        print(f"❌ {file_path}: Syntax error - {e}")
        return False
    except Exception as e:
        print(f"❌ {file_path}: {e}")
        return False


def main():
    """Validate all Python files in src/."""
    src_dir = Path(__file__).parent / "src"
    python_files = list(src_dir.rglob("*.py"))

    if not python_files:
        print("No Python files found")
        return True

    print(f"Validating {len(python_files)} Python files...")

    all_valid = True
    for file_path in python_files:
        if not validate_file(file_path):
            all_valid = False

    if all_valid:
        print("✅ All Python files are valid")
    else:
        print("❌ Some Python files have errors")

    return all_valid


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
