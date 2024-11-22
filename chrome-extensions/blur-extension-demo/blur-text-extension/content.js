// Apply a temporary global blur to the body
document.documentElement.style.filter = 'blur(5px)';

document.addEventListener('DOMContentLoaded', () => {
  // Inject CSS for blurring specific words
  const style = document.createElement('style');
  style.textContent = `
    .blurred-text {
      filter: blur(5px);
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  // Fetch the list of words to blur from storage
  chrome.storage.sync.get("blurWords", ({ blurWords }) => {
    if (!blurWords) {
      console.log("No words to blur.");
      document.documentElement.style.filter = ''; // Remove global blur
      return;
    }

    const words = blurWords.split(",").map(word => word.trim());
    const regex = new RegExp(`\\b(${words.join("|")})\\b`, "gi");

    console.log("Blurring words:", words);

    function blurTextNodes(node) {
      if (!node) return;

      if (node.nodeType === Node.TEXT_NODE) {
        const matches = node.textContent.match(regex);
        if (matches) {
          const parent = node.parentNode;
          if (!parent) return;

          const fragment = document.createDocumentFragment();
          let lastIndex = 0;

          matches.forEach(match => {
            const index = node.textContent.indexOf(match, lastIndex);
            if (index > lastIndex) {
              fragment.appendChild(document.createTextNode(node.textContent.slice(lastIndex, index)));
            }

            const span = document.createElement('span');
            span.textContent = match;
            span.className = 'blurred-text';
            fragment.appendChild(span);

            lastIndex = index + match.length;
          });

          if (lastIndex < node.textContent.length) {
            fragment.appendChild(document.createTextNode(node.textContent.slice(lastIndex)));
          }

          parent.replaceChild(fragment, node);
        }
      } else {
        node.childNodes.forEach(blurTextNodes);
      }
    }

    // Initial blur on page load
    blurTextNodes(document.body);

    // Remove the global blur once processing is complete
    document.documentElement.style.filter = '';

    // Debounce function to limit how often the observer processes changes
    function debounce(func, wait) {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    }

    // Observe changes in the DOM for dynamically loaded content
    const observer = new MutationObserver(debounce(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(addedNode => {
          if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.tagName !== 'SCRIPT') {
            addedNode.childNodes.forEach(blurTextNodes);
          }
        });
      });
    }, 300)); // Debounce with a 300ms delay

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}); 