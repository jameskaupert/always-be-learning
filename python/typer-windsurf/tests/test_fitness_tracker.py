import pytest
from typer.testing import CliRunner
from pathlib import Path
import json
import sys
import os

# Add the parent directory to the Python path so we can import fitness_tracker
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fitness_tracker import app, DATA_FILE

runner = CliRunner()

@pytest.fixture
def clean_data_file():
    """Remove the data file before and after each test"""
    if DATA_FILE.exists():
        DATA_FILE.unlink()
    yield
    if DATA_FILE.exists():
        DATA_FILE.unlink()

def test_add_exercise(clean_data_file):
    result = runner.invoke(app, ["add", "pushups", "10"])
    assert result.exit_code == 0
    assert "Added 10 pushups" in result.stdout

    with open(DATA_FILE, 'r') as f:
        data = json.load(f)
    assert len(data) == 1
    assert data[0]["exercise"] == "pushups"
    assert data[0]["reps"] == 10

def test_add_invalid_exercise(clean_data_file):
    result = runner.invoke(app, ["add", "jumping_jacks", "10"])
    assert result.exit_code == 1
    assert "Invalid exercise type" in result.stdout

def test_add_invalid_reps(clean_data_file):
    result = runner.invoke(app, ["add", "pushups", "0"])
    assert result.exit_code == 1
    assert "Repetitions must be greater than 0" in result.stdout

def test_add_with_date(clean_data_file):
    result = runner.invoke(app, ["add", "pushups", "10", "--date", "2023-01-01"])
    assert result.exit_code == 0
    assert "Added 10 pushups for 2023-01-01" in result.stdout

    with open(DATA_FILE, 'r') as f:
        data = json.load(f)
    assert data[0]["date"] == "2023-01-01"

def test_add_invalid_date(clean_data_file):
    result = runner.invoke(app, ["add", "pushups", "10", "--date", "2023-13-01"])
    assert result.exit_code == 1
    assert "Invalid date format" in result.stdout

def test_summary_empty(clean_data_file):
    result = runner.invoke(app, ["summary"])
    assert result.exit_code == 0
    assert "No entries found" in result.stdout

def test_summary_with_data(clean_data_file):
    # Add some test data
    runner.invoke(app, ["add", "pushups", "10"])
    runner.invoke(app, ["add", "pushups", "15"])
    runner.invoke(app, ["add", "pullups", "5"])

    result = runner.invoke(app, ["summary"])
    assert result.exit_code == 0
    assert "pushups: 25" in result.stdout
    assert "pullups: 5" in result.stdout

def test_history_empty(clean_data_file):
    result = runner.invoke(app, ["history"])
    assert result.exit_code == 0
    assert "No entries found" in result.stdout

def test_history_with_filter(clean_data_file):
    # Add some test data
    runner.invoke(app, ["add", "pushups", "10", "--date", "2023-01-01"])
    runner.invoke(app, ["add", "pullups", "5", "--date", "2023-01-01"])

    result = runner.invoke(app, ["history", "--exercise", "pushups"])
    assert result.exit_code == 0
    assert "10 pushups" in result.stdout
    assert "pullups" not in result.stdout
