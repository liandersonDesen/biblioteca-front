import { useState } from 'react';
import { emprestimoService } from '../services/emprestimoService';

export default function EmprestimoForm({ livros, onSucesso, setErro }) {
  const [livroId, setLivroId] = useState('');
  const [nomeAluno, setNomeAluno] = useState('');
  const [dataDevolucao, setDataDevolucao] = useState('');

  const livrosDisponiveis = livros.filter(l => l.disponivel && !l.excluido);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      await emprestimoService.registrar({
        livroId: Number(livroId),
        nomeAluno,
        dataDevolucao: dataDevolucao
      });

      setLivroId('');
      setNomeAluno('');
      setDataDevolucao('');
      onSucesso(); // Força a atualização assíncrona das tabelas
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
      <h3>Registrar Novo Empréstimo</h3>
      <div style={{ marginBottom: '10px' }}>
        <label>Livro Disponível (Seleção por Nome): </label>
        <select value={livroId} onChange={(e) => setLivroId(e.target.value)} required>
          <option value="">Selecione o livro...</option>
          {livrosDisponiveis.map(livro => (
            <option key={livro.id} value={livro.id}>{livro.titulo}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Nome do Aluno: </label>
        <input type="text" value={nomeAluno} onChange={(e) => setNomeAluno(e.target.value)} required />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Data Limite de Devolução: </label>
        <input type="date" value={dataDevolucao} onChange={(e) => setDataDevolucao(e.target.value)} required />
      </div>
      <button type="submit">Pegar Livro Emprestado</button>
    </form>
  );
}