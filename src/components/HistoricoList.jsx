import { useState } from 'react';

export default function HistoricoList({ emprestimos, livros }) {
  const [busca, setBusca] = useState('');

  const emprestimosFiltrados = emprestimos
    .filter((emp) =>
      emp.nomeAluno.toLowerCase().includes(busca.toLowerCase())
    )
    .sort((a, b) => {
      const [diaA, mesA, anoA] = a.dataEmprestimo.split('/');
      const dataA = new Date(anoA, mesA - 1, diaA);
      const [diaB, mesB, anoB] = b.dataEmprestimo.split('/');
      const dataB = new Date(anoB, mesB - 1, diaB);

      if (dataB.getTime() !== dataA.getTime()) {
        return dataB.getTime() - dataA.getTime();
      }

      return b.id - a.id;
    });

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
    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#1a202c' }}>📋 Histórico Geral de Empréstimos</h3>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="🔍 Pesquisar por nome do aluno..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'sans-serif', fontSize: '15px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#718096' }}>
              <th style={{ padding: '12px 16px', fontWeight: '600' }}>Aluno</th>
              <th style={{ padding: '12px 16px', fontWeight: '600' }}>Livro</th>
              <th style={{ padding: '12px 16px', fontWeight: '600' }}>Data Empréstimo</th>
              <th style={{ padding: '12px 16px', fontWeight: '600' }}>Data Limite</th>
              <th style={{ padding: '12px 16px', fontWeight: '600' }}>Data da Entrega</th>
              <th style={{ padding: '12px 16px', fontWeight: '600' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {emprestimosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#a0aec0' }}>Nenhum registro encontrado.</td>
              </tr>
            ) : (
              emprestimosFiltrados.map((emp) => {
                const livroCorrespondente = livros.find(l => l.id === emp.livroId);
                const nomeDoLivro = livroCorrespondente ? livroCorrespondente.titulo : "Livro não encontrado";

                const foiAtrasado = verificarSeAtrasouNaEntrega(emp);

                let textoStatus = 'Em Aberto';
                let corFundo = '#fff3cd';
                let corTexto = '#856404';

                if (emp.devolvido) {
                  textoStatus = foiAtrasado ? 'Devolvido com Atraso' : 'Devolvido';
                  corFundo = foiAtrasado ? '#fee2e2' : '#d4edda';
                  corTexto = foiAtrasado ? '#ef4444' : '#155724';
                } else if (foiAtrasado) {
                  textoStatus = 'Atrasado (Pendente)';
                  corFundo = '#fee2e2';
                  corTexto = '#ef4444';
                }

                return (
                  <tr key={emp.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                    <td style={{ padding: '16px', fontWeight: '600', color: '#1a202c' }}>{emp.nomeAluno}</td>
                    <td style={{ padding: '16px', color: '#4a5568' }}>📖 {nomeDoLivro}</td>
                    <td style={{ padding: '16px', color: '#718096' }}>{emp.dataEmprestimo}</td>
                    <td style={{ padding: '16px', color: '#718096' }}>{emp.dataDevolucao}</td>
                    <td style={{ padding: '16px', color: emp.devolvido ? '#4a5568' : '#cbd5e0', fontStyle: emp.devolvido ? 'normal' : 'italic' }}>
                      {emp.devolvido ? emp.dataEntregaEfetiva : 'Pendente'}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        backgroundColor: corFundo,
                        color: corTexto,
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        display: 'inline-block'
                      }}>
                        {textoStatus}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}