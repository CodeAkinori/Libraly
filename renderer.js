const { ipcRenderer } = require('electron');

window.onload = () => {
  const input = document.getElementById('searchInput');
  const button = document.getElementById('searchButton');
  const result = document.getElementById('result');

  button.onclick = async () => {
    const query = input.value.trim();
    if (!query) {
      result.textContent = "Digite algo para buscar.";
      return;
    }

    result.textContent = "Buscando...";

    const resp = await ipcRenderer.invoke('search-book', query);

    if (!resp.ok) {
      result.textContent = "Erro ao buscar: " + resp.error;
      return;
    }

    if (!resp.data || resp.data.length === 0) {
      result.textContent = "Nenhum livro encontrado.";
      return;
    }

    result.textContent = resp.data
      .map((book, i) => {
        const authors = book.author_name ? book.author_name.join(", ") : "Autor desconhecido";
        const year = book.first_publish_year || "?";
        return `${i + 1}. ${book.title} - ${authors} (${year})`;
      })
      .join("\n");
  };
};
