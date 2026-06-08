import { useState, useEffect } from 'react';
import { livroService } from '../services/livroService';
import Select from 'react-select';
import './Formulario.css';
import { GENEROS_PADRAO } from '../utils/constantes';

export default function LivroForm({ livroParaEdicao, onSucesso, onCancelar, setErro }) {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [genero, setGenero] = useState('');

  const opcoesGeneros = GENEROS_PADRAO.map(g => ({ value: g, label: g }));

  useEffect(() => {
    if (livroParaEdicao) {
      setTitulo(livroParaEdicao.titulo);
      setAutor(livroParaEdicao.autor);
      setGenero(livroParaEdicao.genero);
    } else {
      setTitulo(''); setAutor(''); setGenero('');
    }
  }, [livroParaEdicao]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      if (livroParaEdicao) {
        await livroService.atualizar(livroParaEdicao.id, { titulo, autor, genero });
      } else {
        await livroService.cadastrar({ titulo, autor, genero });
      }
      setTitulo(''); setAutor(''); setGenero('');
      onSucesso();
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    /* 🎛️ CARD PRINCIPAL BRANCO (Igual ao Histórico e Empréstimos) */
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
          {livroParaEdicao ? '📝 Editar Livro' : '📖 Cadastrar Novo Livro'}
        </h3>
      </div>

      {/* CORPO DO FORMULÁRIO: Agrupado num bloco cinzento leve, idêntico ao fundo dos novos cards */}
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
          <label className="form-label" style={{ marginBottom: '6px' }}>Título do Livro</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: O Hobbit"
            required
            className="form-input"
            style={{ margin: 0, padding: '14px' }}
          />
        </div>

        <div>
          <label className="form-label" style={{ marginBottom: '6px' }}>Autor</label>
          <input
            type="text"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            placeholder="Ex: J.R.R. Tolkien"
            required
            className="form-input"
            style={{ margin: 0, padding: '14px' }}
          />
        </div>

        <div>
          <label className="form-label" style={{ marginBottom: '6px' }}>Gênero do Livro</label>
          <Select
            placeholder="Selecione ou digite um gênero..."
            isSearchable={true}
            options={opcoesGeneros}
            value={genero ? { value: genero, label: genero } : null}
            onChange={(opcaoSelecionada) => setGenero(opcaoSelecionada ? opcaoSelecionada.value : '')}
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

        <button type="submit" className="btn-submit btn-azul" style={{ padding: '14px', fontSize: '15px', marginTop: '10px' }}>
          {livroParaEdicao ? 'Salvar Alterações' : 'Adicionar ao Acervo'}
        </button>

      </form>
    </div>
  );
}