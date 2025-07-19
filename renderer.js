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

    // Limpa resultado anterior
    result.textContent = "";

    resp.data.forEach((book, i) => {
      const authors = book.author_name ? book.author_name.join(", ") : "Autor desconhecido";
      const year = book.first_publish_year || "?";

      const bookUrl = `https://openlibrary.org${book.key}`;
      const div = document.createElement('div');
      div.className = "book";

      div.innerHTML = `
        <div class="book-title">${book.title}</div>
        <div class="book-authors">${authors}</div>
        <div class="book-year">${year}</div>
        <button class="download-btn">Abrir página / Baixar</button>
      `;

      div.querySelector('.download-btn').onclick = () => {
        ipcRenderer.invoke('open-link', bookUrl);
      };

      result.appendChild(div);
    });
  };
};
