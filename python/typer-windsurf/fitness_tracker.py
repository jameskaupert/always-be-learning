import typer
from typing import Optional
from datetime import datetime
import json
import os
from pathlib import Path

app = typer.Typer()
DATA_FILE = Path("fitness_data.json")

def load_data():
    if not DATA_FILE.exists():
        return []
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.command()
def add(
    exercise: str = typer.Argument(..., help="Exercise type (pushups/pullups/lunges/squats)"),
    reps: int = typer.Argument(..., help="Number of repetitions"),
    date: Optional[str] = typer.Option(None, help="Date in YYYY-MM-DD format (defaults to today)")
):
    """Add a new exercise entry."""
    if exercise.lower() not in ['pushups', 'pullups', 'lunges', 'squats']:
        typer.echo(f"Invalid exercise type. Must be one of: pushups, pullups, lunges, squats")
        raise typer.Exit(1)

    if reps <= 0:
        typer.echo("Repetitions must be greater than 0")
        raise typer.Exit(1)

    if date is None:
        date = datetime.now().strftime("%Y-%m-%d")
    else:
        try:
            datetime.strptime(date, "%Y-%m-%d")
        except ValueError:
            typer.echo("Invalid date format. Please use YYYY-MM-DD")
            raise typer.Exit(1)

    data = load_data()
    entry = {
        "date": date,
        "exercise": exercise.lower(),
        "reps": reps
    }
    data.append(entry)
    save_data(data)
    typer.echo(f"Added {reps} {exercise} for {date}")

@app.command()
def history(
    exercise: Optional[str] = typer.Option(None, help="Filter by exercise type"),
    days: Optional[int] = typer.Option(None, help="Number of days to show")
):
    """View exercise history."""
    data = load_data()
    
    if exercise:
        exercise = exercise.lower()
        if exercise not in ['pushups', 'pullups', 'lunges', 'squats']:
            typer.echo(f"Invalid exercise type. Must be one of: pushups, pullups, lunges, squats")
            raise typer.Exit(1)
        data = [entry for entry in data if entry['exercise'] == exercise]

    if days:
        cutoff_date = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")
        data = [entry for entry in data if entry['date'] >= cutoff_date]

    if not data:
        typer.echo("No entries found")
        return

    for entry in sorted(data, key=lambda x: x['date'], reverse=True):
        typer.echo(f"{entry['date']}: {entry['reps']} {entry['exercise']}")

@app.command()
def summary():
    """View summary statistics for all exercises."""
    data = load_data()
    if not data:
        typer.echo("No entries found")
        return

    exercises = {'pushups': 0, 'pullups': 0, 'lunges': 0, 'squats': 0}
    for entry in data:
        exercises[entry['exercise']] += entry['reps']

    typer.echo("Total repetitions:")
    for exercise, total in exercises.items():
        if total > 0:
            typer.echo(f"{exercise}: {total}")

if __name__ == "__main__":
    app()
