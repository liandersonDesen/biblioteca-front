import { useState } from 'react';
import { emprestimoService } from '../services/emprestimoService';

export default function EmprestimoCards({ emprestimos, livros, onSucesso, setErro, onCliqueNovoEmprestimo }) {
  const [pesquisa, setPesquisa] = useState('');

  // 1. Filtra apenas os empréstimos que ainda NÃO foram devolvidos
  const ativos = emprestimos.filter(emp => !emp.devolvido);

  // Função para verificar atraso
  const verificarAtraso = (dataDevolucao) => {
    const [dia, mes, ano] = dataDevolucao.split('/');
    const limite = new Date(ano, mes - 1, dia);
    limite.setHours(0, 0, 0, 0);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return hoje.getTime() > limite.getTime();
  };

  // 2. ⚡ ORDENAÇÃO INTELIGENTE: Prioriza os atrasados e os empréstimos que estão esperando há mais tempo
  const ativosOrdenados = [...ativos].sort((a, b) => {
    const atrasoA = verificarAtraso(a.dataDevolucao);
    const atrasoB = verificarAtraso(b.dataDevolucao);

    // Se um está atrasado e o outro não, o atrasado vai para a frente
    if (atrasoA && !atrasoB) return -1;
    if (!atrasoA && atrasoB) return 1;

    // Se ambos tiverem o mesmo status de atraso, desempata pela data de empréstimo mais antiga
    const [diaA, mesA, anoA] = a.dataEmprestimo.split('/');
    const dataA = new Date(anoA, mesA - 1, diaA);
    const [diaB, mesB, anoB] = b.dataEmprestimo.split('/');
    const dataB = new Date(anoB, mesB - 1, diaB);

    return dataA.getTime() - dataB.getTime();
  });

  // 3. Aplica o filtro de pesquisa em cima da lista já devidamente ordenada
  const filtrados = ativosOrdenados.filter(emp =>
    emp.nomeAluno.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const handleDevolver = async (id) => {
    if (window.confirm("Confirmar a devolução deste livro físico para o acervo?")) {
      try {
        await emprestimoService.devolver(id);
        onSucesso();
      } catch (err) {
        setErro("Erro ao processar devolução.");
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>

      {/* Título do Módulo */}
      <h3 style={{ margin: '0 0 24px 0', fontSize: '22px', color: '#1a202c', fontWeight: '700' }}>🤝 Empréstimos Ativos</h3>

      {/* Topo com Busca e Botão de Novo Empréstimo */}
      {/* Topo com Busca Expandida e Botão de Novo Empréstimo */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        gap: '20px' // Garante uma distância segura entre a barra e o botão
      }}>
        <input
          type="text"
          placeholder="🔍 Buscar por nome do aluno..."
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          style={{
            flexGrow: 1, // 🚀 Faz a barra expandir e ocupar todo o espaço restante da linha
            padding: '14px 18px',
            borderRadius: '8px',
            border: '1px solid #cbd5e0',
            fontSize: '15px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
        <button
          onClick={onCliqueNovoEmprestimo}
          style={{
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            padding: '14px 28px',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '15px',
            boxShadow: '0 2px 4px rgba(40,167,69,0.2)',
            whiteSpace: 'nowrap' // Garante que o texto do botão nunca quebre em duas linhas
          }}
        >
          🤝 Novo Empréstimo
        </button>
      </div>

      {ativos.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#718096', marginTop: '30px', fontSize: '16px' }}>Não há empréstimos ativos no momento.</p>
      ) : (
        /* GRADE COM BLOCOS MAIORES */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '28px' }}>
          {filtrados.map(emp => {
            const livro = livros.find(l => l.id === emp.livroId);
            const atrasado = verificarAtraso(emp.dataDevolucao);

            return (
              <div key={emp.id} style={{
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                padding: '28px',
                border: atrasado ? '2px solid #feb2b2' : '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '260px',
                position: 'relative',
                overflow: 'hidden',
                boxSizing: 'border-box',
                boxShadow: atrasado ? '0 4px 12px rgba(245,101,101,0.05)' : '0 2px 4px rgba(0,0,0,0.02)'
              }}>
                {/* Faixa lateral de status */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '6px',
                  height: '100%',
                  backgroundColor: atrasado ? '#f56565' : '#48bb78'
                }} />

                {/* Bloco de Informações Principais */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#a0aec0', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Aluno</span>
                    <h3 style={{ margin: 0, fontSize: '20px', color: '#1a202c', fontWeight: '700' }}>{emp.nomeAluno}</h3>
                  </div>

                  <div style={{ backgroundColor: '#fff', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#a0aec0', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Livro Retirado</span>
                    <p style={{ margin: 0, fontSize: '15px', color: '#2d3748', fontWeight: '600' }}>
                      📖 {livro ? livro.titulo : 'Livro não identificado'}
                    </p>
                  </div>
                </div>

                {/* Seção de Datas e Prazos */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', backgroundColor: '#edf2f7', padding: '12px', borderRadius: '8px' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#718096', textTransform: 'uppercase' }}>Emprestado</span>
                    {/* 🐛 Bug corrigido aqui abaixo (removido o campo digitado errado) */}
                    <span style={{ fontSize: '13px', color: '#2d3748', fontWeight: '600' }}>{emp.dataEmprestimo}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: atrasado ? '#f56565' : '#718096', textTransform: 'uppercase' }}>Prazo Final</span>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: atrasado ? '#f56565' : '#2d3748' }}>
                      {emp.dataDevolucao} {atrasado && '⚠️ (ATRASADO)'}
                    </span>
                  </div>
                </div>

                {/* Botão de Ação na base */}
                <button
                  onClick={() => handleDevolver(emp.id)}
                  style={{
                    marginTop: '20px',
                    padding: '14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: atrasado ? '#fff5f5' : '#e2e8f0',
                    color: atrasado ? '#c53030' : '#4a5568',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    transition: 'all 0.2s',
                    width: '100%'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = atrasado ? '#c53030' : '#334155';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = atrasado ? '#fff5f5' : '#e2e8f0';
                    e.currentTarget.style.color = atrasado ? '#c53030' : '#4a5568';
                  }}
                >
                  Confirmar Devolução
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}