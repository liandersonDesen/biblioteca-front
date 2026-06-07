import { livroService } from '../services/livroService';

export default function LivroList({ livros, onEditar, onSucesso, setErro }) {
  
  const handleDeletar = async (id) => {
    // Funcionalidade extra: confirmação antes de deletar
    if (!window.confirm("Tem certeza que deseja deletar este livro?")) return;

    try {
      await livroService.deletar(id);
      onSucesso(); // Atualiza a lista automaticamente
    } catch (err) {
      setErro(err.message);
    }
  };

    
    const livrosAtivos = livros.filter(livro => !livro.excluido)
  return (
    <div>
      <h3>Acervo de Livros</h3>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Gênero</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {livrosAtivos.map((livro) => (
            <tr key={livro.id}>
              <td>{livro.titulo}</td>
              <td>{livro.autor}</td>
              <td>{livro.genero}</td>
              <td>
                <span style={{ 
                  backgroundColor: livro.disponivel ? '#d4edda' : '#f8d7da', 
                  color: livro.disponivel ? '#155724' : '#721c24',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  fontSize: '14px'
                }}>
                  {livro.disponivel ? 'Disponível' : 'Emprestado'}
                </span>
              </td>
              <td>
                <button onClick={() => onEditar(livro)} style={{ marginRight: '5px' }}>Editar</button>
                <button onClick={() => handleDeletar(livro.id)} style={{ backgroundColor: '#ffcccc', color: '#cc0000' }}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}