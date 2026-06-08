import { useState, useEffect } from 'react';
import { livroService } from './services/livroService';
import { emprestimoService } from './services/emprestimoService';

import LivroForm from './components/LivroForm';
import LivroCards from './components/LivroCards';
import EmprestimoForm from './components/EmprestimoForm';
import EmprestimoCards from './components/EmprestimoCards'; 
import HistoricoList from './components/HistoricoList';
import Toast from './components/Toast';

export default function App() {
  const [livros, setLivros] = useState([]);
  const [emprestimos, setEmprestimos] = useState([]);
  const [livroParaEdicao, setLivroParaEdicao] = useState(null);
  const [generoFiltro, setGeneroFiltro] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  const [telaAtiva, setTelaAtiva] = useState('livros'); 
  const [notificacao, setNotificacao] = useState({ mensagem: '', tipo: 'erro' });

  const mostrarErro = (msg) => setNotificacao({ mensagem: msg, tipo: 'erro' });
  const mostrarSucesso = (msg) => setNotificacao({ mensagem: msg, tipo: 'sucesso' });
  const fecharNotificacao = () => setNotificacao({ mensagem: '', tipo: 'erro' });

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const [dadosLivros, dadosEmprestimos] = await Promise.all([
        livroService.listarTodos(generoFiltro),
        emprestimoService.listarTodos()
      ]);
      setLivros(dadosLivros);
      setEmprestimos(dadosEmprestimos || []);
    } catch (err) {
      mostrarErro('Falha ao conectar com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [generoFiltro]);

  const dispararEdicao = (livro) => {
    setLivroParaEdicao(livro);
    setTelaAtiva('cadastrar-livro'); 
  };

  // 🎨 Definição de Cores para o efeito "Fusão"
  const corHeaderEscuro = '#1a202c'; // A cor escura elegante que você tinha antes
  const corConteudoBranco = '#ffffff'; // Cor interna do container principal

  return (
    /* 🏗️ CONTAINER PRINCIPAL VERTICAL */
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', // Fundo clarinho das laterais da página
      fontFamily: 'sans-serif'
    }}>
      
      {/* 📋 MENU SUPERIOR (Sua faixa escura restaurada) */}
      <header style={{
        backgroundColor: corHeaderEscuro,
        color: '#fff',
        padding: '20px 40px 0 40px', /* Sem padding inferior para colar as abas na borda */
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', /* 🎯 Centraliza o conteúdo no meio */
        gap: '20px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        
        {/* Lado Esquerdo/Centro: Logotipo centralizado */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '26px' }}>📚</span>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
            BiblioTech
          </h2>
        </div>

        {/* Lado Direito/Baixo: Alinha as abas no limite inferior do header escorrendo para o conteúdo */}
        <nav style={{ 
          display: 'flex', 
          gap: '6px', 
          alignItems: 'flex-end',
          width: '100%',
          maxWidth: '1200px' /* Mantém alinhado com o seu grid de conteúdo */
        }}>
          
          {/* Aba: Livros */}
          <button 
            onClick={() => setTelaAtiva('livros')}
            style={{
              // Se ativa, vira BRANCA (cor do conteúdo). Se inativa, fica num cinza escuro sutil
              background: telaAtiva === 'livros' || telaAtiva === 'cadastrar-livro' ? corConteudoBranco : '#2d3748',
              color: telaAtiva === 'livros' || telaAtiva === 'cadastrar-livro' ? '#1a202c' : '#a0aec0',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px 8px 0 0', 
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '14px',
              transition: 'background-color 0.2s',
              // 🚀 O TRUQUE: Joga a aba ativa 1px para baixo cobrindo a linha de corte
              transform: telaAtiva === 'livros' || telaAtiva === 'cadastrar-livro' ? 'translateY(1px)' : 'none',
              zIndex: telaAtiva === 'livros' || telaAtiva === 'cadastrar-livro' ? 2 : 1
            }}
          >
            📖 Livros
          </button>

          {/* Aba: Empréstimos */}
          <button 
            onClick={() => setTelaAtiva('emprestimos')}
            style={{
              background: telaAtiva === 'emprestimos' || telaAtiva === 'cadastrar-emprestimo' ? corConteudoBranco : '#2d3748',
              color: telaAtiva === 'emprestimos' || telaAtiva === 'cadastrar-emprestimo' ? '#1a202c' : '#a0aec0',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '14px',
              transition: 'background-color 0.2s',
              transform: telaAtiva === 'emprestimos' || telaAtiva === 'cadastrar-emprestimo' ? 'translateY(1px)' : 'none',
              zIndex: telaAtiva === 'emprestimos' || telaAtiva === 'cadastrar-emprestimo' ? 2 : 1
            }}
          >
            🤝 Empréstimos
          </button>

          {/* Aba: Histórico */}
          <button 
            onClick={() => setTelaAtiva('historico')}
            style={{
              background: telaAtiva === 'historico' ? corConteudoBranco : '#2d3748',
              color: telaAtiva === 'historico' ? '#1a202c' : '#a0aec0',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '14px',
              transition: 'background-color 0.2s',
              transform: telaAtiva === 'historico' ? 'translateY(1px)' : 'none',
              zIndex: telaAtiva === 'historico' ? 2 : 1
            }}
          >
            📋 Histórico
          </button>
        </nav>
      </header>

      {/* 💻 CONTEÚDO PRINCIPAL (Agora colado perfeitamente nas abas superiores) */}
      <main style={{ 
        flexGrow: 1, 
        padding: '40px', 
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: corConteudoBranco,
        borderRadius: '0 0 12px 12px', /* Arredonda só embaixo */
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        border: '1px solid #e2e8f0',
        borderTop: 'none', /* Remove a borda de cima para a etiqueta "vazar" livremente */
        zIndex: 1
      }}>
        
        {carregando && (
          <div style={{ color: '#007bff', fontWeight: 'bold', marginBottom: '20px' }}>🔄 Sincronizando dados...</div>
        )}

        {/* ROTA: LISTA DE LIVROS EM CARDS */}
        {telaAtiva === 'livros' && (
          <LivroCards 
            livros={livros}
            emprestimos={emprestimos}
            onEditar={dispararEdicao} 
            onCliqueCadastrar={() => setTelaAtiva('cadastrar-livro')} 
            onSucesso={() => { carregarDados(); mostrarSucesso('Livro removido.'); }}
            setErro={mostrarErro}
            generoFiltro={generoFiltro}
            setGeneroFiltro={setGeneroFiltro}
          />
        )}

        {/* ROTA: FORMULÁRIO DE LIVRO (CADASTRO / EDIÇÃO) */}
        {telaAtiva === 'cadastrar-livro' && (
          <div>
            <LivroForm 
              livroParaEdicao={livroParaEdicao} 
              onSucesso={() => { 
                setLivroParaEdicao(null); 
                carregarDados(); 
                setTelaAtiva('livros'); 
                mostrarSucesso('Livro guardado no acervo com sucesso!');
              }} 
              onCancelar={() => {
                setLivroParaEdicao(null); 
                setTelaAtiva('livros'); 
              }}
              setErro={mostrarErro} 
            />
          </div>
        )}

        {/* ROTA: GERENCIAR EMPRÉSTIMOS EM CARDS */}
        {telaAtiva === 'emprestimos' && (
          <EmprestimoCards 
            emprestimos={emprestimos} 
            livros={livros}
            onSucesso={() => { carregarDados(); mostrarSucesso('Operação concluída!'); }}
            setErro={mostrarErro}
            onCliqueNovoEmprestimo={() => setTelaAtiva('cadastrar-emprestimo')} 
          />
        )}

        {/* ROTA: FORMULÁRIO DE NOVO EMPRÉSTIMO */}
        {telaAtiva === 'cadastrar-emprestimo' && (
          <div>
            <EmprestimoForm 
              livros={livros} 
              onSucesso={() => {
                carregarDados();
                setTelaAtiva('emprestimos'); 
                mostrarSucesso('Empréstimo registrado com sucesso!');
              }}
              onCancelar={() => setTelaAtiva('emprestimos')}
              setErro={mostrarErro} 
            />
          </div>
        )}

        {/* ROTA: HISTÓRICO GERAL */}
        {telaAtiva === 'historico' && (
          <HistoricoList emprestimos={emprestimos} livros={livros} /> 
        )}

      </main>

      <Toast mensagem={notificacao.mensagem} tipo={notificacao.tipo} onFechar={fecharNotificacao} />
    </div>
  );
}