const BASE_URL = 'http://localhost:3000/emprestimos';

export const emprestimoService = {
  async listarTodos() {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Erro ao buscar empréstimos');
    return res.json();
  },

  async registrar(emprestimo) {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emprestimo)
    });
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || 'Erro ao registrar empréstimo');
    }
    return res.json();
  },

  async devolver(id) {
    const res = await fetch(`${BASE_URL}/${id}/devolver`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Erro ao processar devolução');
    return res.json();
  }
};