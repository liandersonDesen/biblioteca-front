import { useState, useEffect } from 'react';
import { livroService } from '../services/livroService';

export default function LivroForm({ livroParaEdicao, onSucesso, setErro }) {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [genero, setGenero] = useState('');

  // Se entrar em modo de edição, preenche os inputs com os dados do livro selecionado
  useEffect(() => {
    if (livroParaEdicao) {
      setTitulo(livroParaEdicao.titulo);
      setAutor(livroParaEdicao.autor);
      setGenero(livroParaEdicao.genero);
    } else {
      setTitulo('');
      setAutor('');
      setGenero('');
    }
  }, [livroParaEdicao]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(''); // Limpa erros antigos

    try {
      if (livroParaEdicao) {
        // Modo Edição
        await livroService.atualizar(livroParaEdicao.id, { titulo, autor, genero });
      } else {
        // Modo Cadastro
        await livroService.cadastrar({ titulo, autor, genero });
      }
      
      // Limpa os campos e avisa o App.jsx para atualizar as listas
      setTitulo('');
      setAutor('');
      setGenero('');
      onSucesso(); 
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
      <h3>{livroParaEdicao ? 'Editar Livro' : 'Cadastrar Novo Livro'}</h3>
      <div style={{ marginBottom: '10px' }}>
        <label>Título: </label>
        <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Autor: </label>
        <input type="text" value={autor} onChange={(e) => setAutor(e.target.value)} required />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Gênero: </label>
        <input type="text" value={genero} onChange={(e) => setGenero(e.target.value)} required />
      </div>
      <button type="submit">{livroParaEdicao ? 'Salvar Alterações' : 'Cadastrar'}</button>
      {livroParaEdicao && <button type="button" onClick={onSucesso} style={{ marginLeft: '10px' }}>Cancelar</button>}
    </form>
  );
}