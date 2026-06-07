import { useState } from 'react';

export default function HistoricoList({ emprestimos, livros }) {
  const [busca, setBusca] = useState('');

  const emprestimosFiltrados = emprestimos.filter((emp) =>
    emp.nomeAluno.toLowerCase().includes(busca.toLowerCase())
  );

  const verificarSeAtrasouNaEntrega = (emp) => {
    if (!emp.devolvido) {
      const [diaD, mesD, anoD] = emp.dataDevolucao.split('/');
      const dataLimite = new Date(anoD, mesD - 1, diaD);
      dataLimite.setHours(0, 0, 0, 0);

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      return hoje.getTime() > dataLimite.getTime();
    }

    if (emp.devolvido && emp.dataEntregaEfetiva) {
      const [diaD, mesD, anoD] = emp.dataDevolucao.split('/');
      const [diaE, mesE, anoE] = emp.dataEntregaEfetiva.split('/');

      const dataLimite = new Date(anoD, mesD - 1, diaD);
      const dataEntrega = new Date(anoE, mesE - 1, diaE);

      dataLimite.setHours(0, 0, 0, 0);
      dataEntrega.setHours(0, 0, 0, 0);

      return dataEntrega.getTime() > dataLimite.getTime();
    }

    return false;
  };

  return (
    <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '20px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
      <h3>📋 Histórico Geral de Empréstimos</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Pesquisar por nome do aluno..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: '#fff' }}>
        <thead style={{ backgroundColor: '#eee' }}>
          <tr>
            <th>Aluno</th>
            <th>Livro</th>
            <th>Data Empréstimo</th>
            <th>Data Limite</th>
            <th>Data da Entrega</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {emprestimosFiltrados.map((emp) => {
            const livroCorrespondente = livros.find(l => l.id === emp.livroId);
            const nomeDoLivro = livroCorrespondente ? livroCorrespondente.titulo : "Livro não encontrado";
            
            const foiAtrasado = verificarSeAtrasouNaEntrega(emp);

            let textoStatus = 'Em Aberto';
            let corFundo = '#fff3cd'; 
            let corTexto = '#856404';

            if (emp.devolvido) {
              textoStatus = foiAtrasado ? 'Devolvido com Atraso' : 'Devolvido';
              corFundo = foiAtrasado ? '#f8d7da' : '#d4edda'; 
              corTexto = foiAtrasado ? '#721c24' : '#155724'; 
            } else if (foiAtrasado) {
              textoStatus = 'Atrasado (Pendente)';
              corFundo = '#f8d7da';
              corTexto = '#721c24';
            }

            return (
              <tr key={emp.id}>
                <td style={{ fontWeight: 'bold' }}>{emp.nomeAluno}</td>
                <td>{nomeDoLivro}</td>
                <td>{emp.dataEmprestimo}</td>
                <td>{emp.dataDevolucao}</td>
                <td style={{ color: emp.devolvido ? '#555' : '#aaa', fontStyle: emp.devolvido ? 'normal' : 'italic' }}>
                  {emp.devolvido ? emp.dataEntregaEfetiva : 'Pendente'}
                </td>
                <td>
                  <span style={{
                    backgroundColor: corFundo,
                    color: corTexto,
                    padding: '4px 10px',
                    borderRadius: '3px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    display: 'inline-block'
                  }}>
                    {textoStatus}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}