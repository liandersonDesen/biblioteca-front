import { useState, useEffect } from 'react';
import { livroService } from './services/livroService';
import { emprestimoService } from './services/emprestimoService';

import LivroForm from './components/LivroForm';
import LivroList from './components/LivroList';
import EmprestimoForm from './components/EmprestimoForm';
import EmprestimoList from './components/EmprestimoList';
import HistoricoList from './components/HistoricoList';
import Toast from './components/Toast';

export default function App() {
  const [livros, setLivros] = useState([]);
  const [emprestimos, setEmprestimos] = useState([]);
  const [livroParaEdicao, setLivroParaEdicao] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [telaAtiva, setTelaAtiva] = useState('operacoes');
  const [notificacao, setNotificacao] = useState({ mensagem: '', tipo: 'erro' });

  const mostrarErro = (msg) => setNotificacao({ mensagem: msg, tipo: 'erro' });
  const mostrarSucesso = (msg) => setNotificacao({ mensagem: msg, tipo: 'sucesso' });
  const fecharNotificacao = () => setNotificacao({ mensagem: '', tipo: 'erro' });

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const [dadosLivros, dadosEmprestimos] = await Promise.all([
        livroService.listarTodos(),
        emprestimoService.listarTodos()
      ]);
      setLivros(dadosLivros);
      setEmprestimos(dadosEmprestimos);
    } catch (err) {
      mostrarErro('Falha ao conectar com o servidor. Verifique se o backend está rodando.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const dispararEdicao = (livro) => {
    setLivroParaEdicao(livro);
    setTelaAtiva('operacoes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h1>📚 Sistema de Controle de Biblioteca</h1>

      {erro && (
        <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
          ❌ Erro do Sistema: {erro}
        </div>
      )}

      {carregando && (
        <div style={{ fontSize: '18px', color: '#0056b3', marginBottom: '15px' }}>
          🔄 Carregando dados da API...
        </div>
      )}

      {/* Menu de Navegação por Abas */}
      <nav style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setTelaAtiva('operacoes')}
          style={{
            padding: '10px 20px',
            fontWeight: 'bold',
            backgroundColor: telaAtiva === 'operacoes' ? '#007bff' : '#eee',
            color: telaAtiva === 'operacoes' ? '#fff' : '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ⚙️ Operações e Cadastros
        </button>
        <button 
          onClick={() => setTelaAtiva('historico')}
          style={{
            padding: '10px 20px',
            fontWeight: 'bold',
            backgroundColor: telaAtiva === 'historico' ? '#007bff' : '#eee',
            color: telaAtiva === 'historico' ? '#fff' : '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          📋 Histórico Geral
        </button>
      </nav>

      {/* RENDERIZAÇÃO CONDICIONAL DAS TELAS */}
      {telaAtiva === 'operacoes' ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <LivroForm 
              livroParaEdicao={livroParaEdicao} 
              onSucesso={() => { 
                setLivroParaEdicao(null); 
                carregarDados(); 
                mostrarSucesso('Operação no acervo realizada com sucesso!');
              }} 
              setErro={mostrarErro} 
            />
            <EmprestimoForm 
              livros={livros} 
              onSucesso={() => {
                carregarDados();
                mostrarSucesso('Empréstimo registrado com sucesso!');
              }} 
              setErro={mostrarErro} 
            />
          </div>

          <hr style={{ margin: '30px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <LivroList 
              livros={livros} 
              onEditar={dispararEdicao} 
              onSucesso={() => {
                carregarDados();
                mostrarSucesso('Livro removido do acervo.');
              }} 
              setErro={mostrarErro} 
            />
            <EmprestimoList 
              emprestimos={emprestimos} 
              livros={livros}
              onSucesso={carregarDados} 
              setErro={setErro} 
            />
          </div>
        </>
      ) : (
        <HistoricoList typeof emprestimos={emprestimos} emprestimos={emprestimos} livros={livros} />
      )}

      <Toast 
        mensagem={notificacao.mensagem} 
        tipo={notificacao.tipo} 
        onFechar={fecharNotificacao} 
      />
    </div>
  );
}