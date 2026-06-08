import { useState, useMemo } from 'react';
import { emprestimoService } from '../services/emprestimoService';
import Select from 'react-select';

export default function EmprestimoForm({ livros, onSucesso, onCancelar, setErro }) {
  const [livroId, setLivroId] = useState('');
  const [nomeAluno, setNomeAluno] = useState('');
  const [dataDevolucao, setDataDevolucao] = useState('');

  const opcoesLivros = useMemo(() => {
    if (!livros) return [];
    return livros
      .filter(l => l.disponivel && !l.excluido)
      .map(livro => ({ value: livro.id, label: livro.titulo }));
  }, [livros]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!livroId) {
      setErro('Por favor, selecione um livro disponível.');
      return;
    }

    try {
      await emprestimoService.registrar({
        livroId: Number(livroId),
        nomeAluno,
        dataDevolucao: dataDevolucao
      });

      setLivroId('');
      setNomeAluno('');
      setDataDevolucao('');

      onSucesso();
    } catch (err) {
      setErro(err.message || 'Ocorreu um erro ao registrar o empréstimo.');
    }
  };

  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '32px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
    }}>

      {/* ⬅️ BARRA DO TOPO: Seta de voltar e Título alinhados */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button
          type="button"
          onClick={onCancelar}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '22px',
            cursor: 'pointer',
            color: '#4a5568',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 12px',
            borderRadius: '8px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          title="Voltar"
        >
          ←
        </button>

        <h3 style={{ margin: 0, fontSize: '22px', color: '#1a202c', fontWeight: '700' }}>
          🤝 Registrar Novo Empréstimo
        </h3>
      </div>

      {/* CORPO DO FORMULÁRIO: Agrupado num bloco cinzento leve */}
      <form onSubmit={handleSubmit} className="form-card" style={{
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        padding: '28px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>

        <div>
          <label className="form-label" style={{ marginBottom: '6px' }}>Livro Disponível</label>
          <Select
            placeholder="Selecione ou digite um livro..."
            isSearchable={true}
            options={opcoesLivros}
            value={livroId ? opcoesLivros.find(opt => opt.value === livroId) : null}
            onChange={(opcaoSelecionada) => setLivroId(opcaoSelecionada ? opcaoSelecionada.value : '')}
            styles={{
              control: (base, state) => ({
                ...base,
                minHeight: '48px',
                border: state.isFocused ? '1px solid #007bff' : '1px solid #cbd5e0',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                boxShadow: state.isFocused ? '0 0 0 3px rgba(0, 123, 255, 0.15)' : 'none',
                fontFamily: 'sans-serif',
                fontSize: '15px',
                cursor: 'pointer',
                '&:hover': { border: state.isFocused ? '1px solid #007bff' : '1px solid #cbd5e0' }
              }),
              valueContainer: (base) => ({ ...base, padding: '0 14px' }),
              input: (base) => ({ ...base, margin: 0, padding: 0, color: '#1a202c' }),
              placeholder: (base) => ({ ...base, color: '#a0aec0' }),
              singleValue: (base) => ({ ...base, color: '#1a202c' }),
              indicatorSeparator: () => ({ display: 'none' }),
              dropdownIndicator: (base) => ({ ...base, color: '#4a5568' }),
              menu: (base) => ({
                ...base,
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0',
                zIndex: 15
              }),
              option: (base, state) => ({
                ...base,
                fontFamily: 'sans-serif',
                fontSize: '15px',
                padding: '12px 14px',
                backgroundColor: state.isSelected ? '#007bff' : state.isFocused ? '#edf2f7' : '#ffffff',
                color: state.isSelected ? '#ffffff' : '#1a202c',
                cursor: 'pointer'
              })
            }}
          />
        </div>

        <div>
          <label className="form-label" style={{ marginBottom: '6px' }}>Nome do Aluno</label>
          <input
            type="text"
            value={nomeAluno}
            onChange={(e) => setNomeAluno(e.target.value)}
            placeholder="Digite o nome completo do aluno"
            required
            className="form-input"
            style={{ margin: 0, padding: '14px' }}
          />
        </div>

        <div>
          <label className="form-label" style={{ marginBottom: '6px' }}>Data Limite de Devolução</label>
          <input
            type="date"
            value={dataDevolucao}
            onChange={(e) => setDataDevolucao(e.target.value)}
            required
            className="form-input"
            style={{ margin: 0, padding: '14px' }}
          />
        </div>

        <button type="submit" className="btn-submit btn-verde" style={{ padding: '14px', fontSize: '15px', marginTop: '10px' }}>
          Confirmar Empréstimo
        </button>

      </form>
    </div>
  );
}