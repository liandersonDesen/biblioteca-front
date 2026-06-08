import { useState } from 'react';
import { createPortal } from 'react-dom';
import { livroService } from '../services/livroService';
import { GENEROS_PADRAO } from '../utils/constantes.js';
import Select from 'react-select';

export default function LivroCards({ livros, onEditar, onCliqueCadastrar, onSucesso, setErro, generoFiltro, setGeneroFiltro, emprestimos }) {
  const [pesquisa, setPesquisa] = useState('');
  const [livroSelecionado, setLivroSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);

  // 🔍 Estado do filtro: false = Oculta emprestados/Mostra só disponíveis (padrão) | true = Mostra TODOS os livros
  const [mostrarTodosOsLivros, setMostrarTodosOsLivros] = useState(false);

  const opcoesGenerosPadroes = GENEROS_PADRAO.map(g => ({ value: g, label: g }));
  const opcoesGeneros = [{ value: '', label: '📚 Todos os Gêneros' }, ...opcoesGenerosPadroes];

  // 🔄 Filtros aplicados na lista (Lógica Corrigida!)
  const livrosFiltrados = livros
    .filter(l => !l.excluido)
    .filter(l => l.titulo.toLowerCase().includes(pesquisa.toLowerCase()))
    .filter(l => generoFiltro === '' || l.genero === generoFiltro)
    .filter(l => {
      if (mostrarTodosOsLivros) {
        return true; // Se marcado, não barra ninguém. Mostra TODOS (Disponíveis + Emprestados)
      }
      return l.disponivel; // Se desmarcado (padrão), traz APENAS os disponíveis (retira os emprestados)
    });

  const handleDeletar = async (id) => {
    if (window.confirm("Tem certeza que deseja arquivar este livro?")) {
      try {
        await livroService.deletar(id);
        onSucesso();
      } catch (err) {
        setErro("Erro ao deletar o livro.");
      }
    }
  };

  const abrirModal = (livro) => {
    setLivroSelecionado(livro);
    setModalAberto(true);
  };

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

  // Filtra o histórico específico deste livro e ordena por data mais recente (topo)
  const historicoDoLivro = emprestimos && livroSelecionado
    ? emprestimos
      .filter(emp => emp.livroId === livroSelecionado.id)
      .sort((a, b) => {
        const [diaA, mesA, anoA] = a.dataEmprestimo.split('/');
        const dataA = new Date(anoA, mesA - 1, diaA);
        const [diaB, mesB, anoB] = b.dataEmprestimo.split('/');
        const dataB = new Date(anoB, mesB - 1, diaB);

        if (dataB.getTime() !== dataA.getTime()) {
          return dataB.getTime() - dataA.getTime();
        }

        return b.id - a.id;
      })
    : [];

  return (
    <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>

      {/* SEÇÃO DE FILTROS E PESQUISA */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#1a202c', fontWeight: '700' }}>
          📖 Gestão do Acervo de Livros
        </h1>
        <p style={{ margin: '4px 0 0 0', color: '#4a5568', fontSize: '14px' }}>
          Consulte, filtre, edite ou registre novos livros na biblioteca.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', flexGrow: 1, maxWidth: '800px' }}>
            <input
              type="text"
              placeholder="🔍 Pesquisar livro pelo título..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              style={{ flex: 2, padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '15px', outline: 'none' }}
            />
            <div style={{ flex: 1, minWidth: '220px' }}>
              <Select
                placeholder="Filtrar por Gênero..."
                options={opcoesGeneros}
                value={opcoesGeneros.find(o => o.value === generoFiltro) || opcoesGeneros[0]}
                onChange={(opcao) => setGeneroFiltro(opcao ? opcao.value : '')}
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '45px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e0',
                    boxShadow: 'none',
                    fontSize: '15px',
                    cursor: 'pointer',
                    '&:hover': { border: '1px solid #cbd5e0' }
                  }),
                  indicatorSeparator: () => ({ display: 'none' })
                }}
              />
            </div>
          </div>

          <button
            onClick={onCliqueCadastrar}
            style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#007bff', color: '#fff', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,123,255,0.2)', whiteSpace: 'nowrap' }}
          >
            ➕ Novo Livro
          </button>
        </div>

        {/* 📑 CHECKBOX DE FILTRO CORRIGIDO DE ACORDO COM A SUA REGRA */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            color: '#4a5568',
            backgroundColor: '#edf2f7',
            padding: '8px 16px',
            borderRadius: '20px',
            userSelect: 'none',
            transition: 'background-color 0.2s'
          }}>
            <input
              type="checkbox"
              checked={mostrarTodosOsLivros}
              onChange={(e) => setMostrarTodosOsLivros(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                cursor: 'pointer',
                accentColor: '#007bff'
              }}
            />
            <span>{mostrarTodosOsLivros ? "📚 Incluindo Livros Emprestados (Exibindo Tudo)" : "🔹 Exibindo Apenas Livros Disponíveis para Empréstimo"}</span>
          </label>
        </div>
      </div>

      {/* GRID DE CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {livrosFiltrados.map((livro) => (
          <div
            key={livro.id}
            onClick={() => abrirModal(livro)}
            style={{
              backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '20px', backgroundColor: livro.disponivel ? '#d4edda' : '#fff3cd', color: livro.disponivel ? '#155724' : '#856404' }}>
                  {livro.disponivel ? 'Disponível' : 'Emprestado'}
                </span>
                <span style={{ fontSize: '13px', color: '#718096', fontWeight: '500' }}>{livro.genero}</span>
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#1a202c' }}>{livro.titulo}</h3>
              <p style={{ margin: 0, color: '#4a5568', fontSize: '14px' }}>👤 {livro.autor}</p>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
              <button onClick={(e) => { e.stopPropagation(); onEditar(livro); }} style={{ flexGrow: 1, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0', backgroundColor: '#fff', color: '#4a5568', cursor: 'pointer', fontWeight: '600' }}>Editar</button>
              <button onClick={(e) => { e.stopPropagation(); handleDeletar(livro.id); }} style={{ flexGrow: 1, padding: '8px', borderRadius: '6px', border: 'none', backgroundColor: '#fed7d7', color: '#c53030', cursor: 'pointer', fontWeight: '600' }}>Arquivar</button>
            </div>
          </div>
        ))}
      </div>

      {livrosFiltrados.length === 0 && (
        <div style={{ textAlign: 'center', color: '#718096', padding: '40px', fontSize: '16px' }}>
          Nenhum livro encontrado para os filtros selecionados.
        </div>
      )}

      {/* 🌟 MODAL COM RELATÓRIO RECUPERADO E ESTILIZADO */}
      {modalAberto && livroSelecionado && createPortal(
        <div
          onClick={() => setModalAberto(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000 // 🚀 Como está no body, isso passa por cima de TUDO no sistema
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#fff',
              width: '90%',
              maxWidth: '480px',
              maxHeight: '82vh', // Mantém o modal compacto e elegante na tela
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              border: '1px solid #e2e8f0'
            }}
          >
            {/* Botão de fechar (X) */}
            <button
              onClick={() => setModalAberto(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#a0aec0', zIndex: 10 }}
            >
              ✕
            </button>

            {/* Cabeçalho dos Dados do Livro */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              marginBottom: '20px',
              borderBottom: '2px solid #e2e8f0',
              paddingBottom: '16px',
              flexShrink: 0
            }}>
              <div style={{ fontSize: '44px', marginBottom: '8px' }}>📖</div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '20px', backgroundColor: livroSelecionado.disponivel ? '#d4edda' : '#fff3cd', color: livroSelecionado.disponivel ? '#155724' : '#856404' }}>
                  {livroSelecionado.disponivel ? 'Disponível' : 'Emprestado'}
                </span>
                <h2 style={{ margin: '8px 0 2px 0', fontSize: '20px', color: '#1a202c', fontWeight: '700' }}>
                  {livroSelecionado.titulo}
                </h2>
                <p style={{ margin: '0 0 4px 0', color: '#4a5568', fontSize: '14px' }}>👤 {livroSelecionado.autor}</p>
                <p style={{ margin: 0, color: '#718096', fontSize: '12px' }}>🏷️ Gênero: {livroSelecionado.genero}</p>
              </div>
            </div>

            {/* Seção do Histórico com Rolagem Própria */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              padding: '16px',
              overflowY: 'auto',
              flexGrow: 1
            }}>
              <h3 style={{ fontSize: '15px', color: '#1a202c', margin: '0 0 16px 0', fontWeight: '700', textAlign: 'center' }}>
                📋 Relatório de Empréstimos
              </h3>

              {historicoDoLivro.length === 0 ? (
                <p style={{ color: '#a0aec0', padding: '16px', fontSize: '13px', margin: 0, textAlign: 'center' }}>
                  Nenhum registro de empréstimo encontrado para este livro.
                </p>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  textAlign: 'left'
                }}>
                  {historicoDoLivro.map((emp, index) => {
                    const foiAtrasado = verificarSeAtrasouNaEntrega(emp);
                    let fraseRelatorio = '';
                    let corDestaqueStatus = '#1a202c';

                    if (!emp.devolvido) {
                      if (foiAtrasado) {
                        fraseRelatorio = `🔴 ${emp.nomeAluno} pegou o livro na data ${emp.dataEmprestimo} e ainda não entregou. O prazo expirou em ${emp.dataDevolucao} e está atrasado.`;
                        corDestaqueStatus = '#ef4444';
                      } else {
                        fraseRelatorio = `🟡 ${emp.nomeAluno} pegou o livro na data ${emp.dataEmprestimo} e ainda não entregou, tendo até o dia ${emp.dataDevolucao} para realizar a entrega.`;
                        corDestaqueStatus = '#b45309';
                      }
                    } else {
                      if (foiAtrasado) {
                        fraseRelatorio = `🔴 ${emp.nomeAluno} pegou o livro na data ${emp.dataEmprestimo} e entregou na data ${emp.dataEntregaEfetiva} com atraso (o prazo limite era ${emp.dataDevolucao}).`;
                        corDestaqueStatus = '#718096';
                      } else {
                        fraseRelatorio = `🟢  ${emp.nomeAluno} pegou o livro na data ${emp.dataEmprestimo} e entregou na data ${emp.dataEntregaEfetiva} dentro do prazo.`;
                        corDestaqueStatus = '#16a34a';
                      }
                    }

                    return (
                      <div
                        key={emp.id}
                        style={{
                          fontSize: '13px',
                          lineHeight: '1.6',
                          color: '#2d3748',
                          paddingBottom: index === historicoDoLivro.length - 1 ? 0 : '12px',
                          borderBottom: index === historicoDoLivro.length - 1 ? 'none' : '1px dashed #e2e8f0'
                        }}
                      >
                        <span style={{ color: corDestaqueStatus, fontWeight: foiAtrasado || !emp.devolvido ? '600' : 'normal' }}>
                          {fraseRelatorio}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>,
        document.body // 👈 Alvo do portal: joga o modal diretamente no body!
      )}

    </div>
  );
}