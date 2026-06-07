const BASE_URL = 'http://localhost:3000/livros';

export const livroService = {
  async listarTodos() {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Erro ao buscar livros');
    return res.json();
  },

  async cadastrar(livro) {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(livro)
    });
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || 'Erro ao cadastrar livro');
    }
    return res.json();
  },

  async atualizar(id, livro) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(livro)
    });
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || 'Erro ao atualizar livro');
    }
    return res.json();
  },

  async deletar(id) {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao deletar livro');
    return res.text();
  }
};