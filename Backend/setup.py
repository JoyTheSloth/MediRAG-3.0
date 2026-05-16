from setuptools import setup, find_packages

setup(
    name="medirag-cli",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "typer>=0.9.0",
    ],
    entry_points={
        "console_scripts": [
            "medirag=src.cli:app",
        ],
    },
)
