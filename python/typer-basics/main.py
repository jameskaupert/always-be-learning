import os
import typer

app = typer.Typer()

@app.command()
def greet_environment():
    name = os.getenv("MY_NAME", "World")
    print(f"Hello {name} from Python")

@app.command()
def hello(name: str):
    print(f"Hello, {name}")

@app.command()
def goodbye(name: str, formal: bool = False):
    if formal:
        print(f"Goodbye {name}. Have a great day!")
    else:
        print(f"Bye {name}!")

if __name__ == "__main__":
    app()
