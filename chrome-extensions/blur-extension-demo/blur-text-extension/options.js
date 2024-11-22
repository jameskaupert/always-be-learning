document.getElementById("save").addEventListener("click", () => {
  const wordList = document.getElementById("wordList").value;
  chrome.storage.sync.set({ blurWords: wordList }, () => {
    alert("Word list saved!");
  });
});

document.getElementById("export").addEventListener("click", () => {
  chrome.storage.sync.get("blurWords", ({ blurWords }) => {
    const blob = new Blob([blurWords || ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blur_words.txt";
    a.click();
    URL.revokeObjectURL(url);
  });
});

document.getElementById("importButton").addEventListener("click", () => {
  document.getElementById("import").click();
});

document.getElementById("import").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const importedWords = e.target.result;
      document.getElementById("wordList").value = importedWords;
      chrome.storage.sync.set({ blurWords: importedWords }, () => {
        alert("Word list imported!");
      });
    };
    reader.readAsText(file);
  }
});

// Load the current word list
chrome.storage.sync.get("blurWords", ({ blurWords }) => {
  document.getElementById("wordList").value = blurWords || "";
}); 