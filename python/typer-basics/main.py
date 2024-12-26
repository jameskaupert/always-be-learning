import os
import typer
from rich import print
from rich.console import Console
from rich.table import Table

data = {
    "name": "Rick",
    "age": 42,
    "items": [{"name": "Portal Gun"}, {"name": "Plumbus"}],
    "active": True,
    "affiliation": None,
}

app = typer.Typer()
console = Console()

@app.command()
def greet_environment():
    name = os.getenv("MY_NAME", "World")
    print(f"Hello {name} from Python")

@app.command()
def hello(firstname: str, lastname: str = "", formal: bool = False):
    """
    Say hello to FIRSTNAME, optionally with a --lastname

    If --formal used, say it more formally.
    """
    if formal:
        print(f"Good day {firstname} {lastname}.")
    else:
        print(f"Hello, {firstname}")

@app.command()
def goodbye(name: str, formal: bool = False):
    if formal:
        print(f"Goodbye {name}. Have a great day! :red_heart:")
    else:
        print(f"Bye {name}!")

@app.command()
def print_color_data(custom: bool = False):
    if custom:
        print("[bold red]Alert![/bold red] :warning:")
    else:
        print(data)

@app.command()
def print_table():
    table = Table("Name", "Item")
    table.add_row("Rick", "Portal Gun")
    table.add_row("Morty", "Plumbus")
    console.print(table)

if __name__ == "__main__":
    app()
