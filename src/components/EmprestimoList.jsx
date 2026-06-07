import { emprestimoService } from '../services/emprestimoService';

export default function EmprestimoList({ emprestimos, livros, onSucesso, setErro }) {
  
  const handleDevolucao = async (id) => {
    try {
      const dados = await emprestimoService.devolver(id);
      if (dados.estaAtrasado) {
        alert("⚠️ Livro Devolvido com ATRASO!");
      } else {
        alert("✅ Livro devolvido no prazo!");
      }
      onSucesso();
    } catch (err) {
      setErro(err.message);
    }
  };

  const { emprestimosAtivos } = { emprestimosAtivos: emprestimos.filter(emp => !emp.devolvido) };

  return (
    <div>
      <h3>Empréstimos Ativos</h3>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Livro</th> {/* Mudou de ID do Livro para Livro */}
            <th>Aluno</th>
            <th>Data Empréstimo</th>
            <th>Data Limite Devolução</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          { emprestimosAtivos.map((emp) => {
            const livroCorrespondente = livros.find(l => l.id === emp.livroId);
            const nomeDoLivro = livroCorrespondente ? livroCorrespondente.titulo : "Livro não encontrado";

            return (
              <tr key={emp.id}>
                <td style={{ fontWeight: 'bold' }}>{nomeDoLivro}</td>
                <td>{emp.nomeAluno}</td>
                <td>{emp.dataEmprestimo}</td>
                <td>{emp.dataDevolucao}</td>
                <td>
                  <button onClick={() => handleDevolucao(emp.id)} style={{ backgroundColor: '#e0f0ff' }}>
                    Marcar como Devolvido
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}