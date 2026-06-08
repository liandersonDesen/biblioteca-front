import { useState } from 'react';
import { emprestimoService } from '../services/emprestimoService';
import Select from 'react-select';

export default function EmprestimoForm({ livros, onSucesso, setErro }) {
  const [livroId, setLivroId] = useState('');
  const [nomeAluno, setNomeAluno] = useState('');
  const [dataDevolucao, setDataDevolucao] = useState('');

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

      onSucesso();
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h3 className="form-titulo">🤝 Registrar Novo Empréstimo</h3>

      <div>
        <label className="form-label">Livro Disponível</label>
        <Select
          placeholder="Selecione ou digite um livro..."
          isSearchable={true}
          options={livros
            .filter(l => l.disponivel && !l.excluido)
            .map(livro => ({ value: livro.id, label: livro.titulo }))
          }
          onChange={(opcaoSelecionada) => setLivroId(opcaoSelecionada ? opcaoSelecionada.value : '')}
          styles={{
            // 🎛️ Caixa externa (controla as margens e o posicionamento)
            container: (base) => ({
              ...base,
              marginTop: '6px',
              marginBottom: '16px',
            }),
            // 🛠️ O input em si (ajusta altura, borda e fundo para clonar o seu CSS)
            control: (base, state) => ({
              ...base,
              minHeight: '40px', // Força a altura exata do seu input com padding 10px
              border: state.isFocused ? '1px solid #007bff' : '1px solid #cbd5e0',
              borderRadius: '8px',
              backgroundColor: state.isFocused ? '#ffffff' : '#f8fafc',
              boxShadow: state.isFocused ? '0 0 0 3px rgba(0, 123, 255, 0.15)' : 'none',
              fontFamily: 'sans-serif',
              fontSize: '15px',
              cursor: 'pointer',
              '&:hover': {
                border: state.isFocused ? '1px solid #007bff' : '1px solid #cbd5e0'
              }
            }),
            // ✍️ Alinha o texto do placeholder e do livro selecionado
            valueContainer: (base) => ({
              ...base,
              padding: '0 14px', // Bate com o padding-left do seu CSS
            }),
            // 🔍 Ajusta o texto que o usuário digita para pesquisar
            input: (base) => ({
              ...base,
              margin: 0,
              padding: 0,
              color: '#1a202c',
            }),
            // 📄 O texto do placeholder parado
            placeholder: (base) => ({
              ...base,
              color: '#718096',
            }),
            // 🏛️ Ajusta o texto fixo quando o livro já está selecionado
            singleValue: (base) => ({
              ...base,
              color: '#1a202c',
            }),
            // 🧼 Remove aquela linha divisória feia que fica antes da setinha
            indicatorsContainer: (base) => ({
              ...base,
              paddingRight: '6px',
            }),
            indicatorSeparator: () => ({
              display: 'none',
            }),
            dropdownIndicator: (base, state) => ({
              ...base,
              color: '#4a5568',
              '&:hover': { color: '#1a202c' }
            }),
            // 📋 O Menu suspenso (A caixinha das opções)
            menu: (base) => ({
              ...base,
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              marginTop: '4px',
              zIndex: 10, // Garante que não vai cortar ou passar por baixo de nada
            }),
            // ✨ Cada opção dentro do menu
            option: (base, state) => ({
              ...base,
              fontFamily: 'sans-serif',
              fontSize: '15px',
              padding: '10px 14px', // Mesma folga interna dos outros campos
              backgroundColor: state.isSelected
                ? '#007bff'
                : state.isFocused
                  ? '#edf2f7' // Cinza bem sutil ao passar o mouse
                  : '#ffffff',
              color: state.isSelected ? '#ffffff' : '#1a202c',
              cursor: 'pointer',
              '&:active': {
                backgroundColor: '#edf2f7'
              }
            })
          }}
        />
      </div>

      <div>
        <label className="form-label">Nome do Aluno</label>
        <input
          type="text"
          value={nomeAluno}
          onChange={(e) => setNomeAluno(e.target.value)}
          placeholder="Digite o nome completo do aluno"
          required
          className="form-input"
        />
      </div>

      <div>
        <label className="form-label">Data Limite de Devolução</label>
        <input
          type="date"
          value={dataDevolucao}
          onChange={(e) => setDataDevolucao(e.target.value)}
          required
          className="form-input"
        />
      </div>

      <button type="submit" className="btn-submit btn-verde">Confirmar Empréstimo</button>
    </form>
  );
}