import os
import typer

app = typer.Typer()

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
        print(f"Goodbye {name}. Have a great day!")
    else:
        print(f"Bye {name}!")

if __name__ == "__main__":
    app()
