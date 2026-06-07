import { useEffect } from 'react';

export default function Toast({ mensagem, tipo = 'erro', onFechar }) {
  // Efeito para fazer o aviso sumir sozinho depois de 4 segundos
  useEffect(() => {
    if (!mensagem) return;

    const timer = setTimeout(() => {
      onFechar();
    }, 4000);

    return () => clearTimeout(timer);
  }, [mensagem, onFechar]);

  if (!mensagem) return null;

  // Cores dinâmicas com base no tipo de aviso
  const ehErro = tipo === 'erro';
  const corFundo = ehErro ? '#f8d7da' : '#d4edda';
  const corTexto = ehErro ? '#721c24' : '#155724';
  const corBorda = ehErro ? '#f5c6cb' : '#c3e6cb';

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: corFundo,
      color: corTexto,
      border: `1px solid ${corBorda}`,
      padding: '16px 24px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 9999, // Garante que vai ficar por cima de QUALQUER elemento da página
      minWidth: '280px',
      maxWidth: '400px',
      display: 'flex',
      justifyContent: 'between',
      alignItems: 'center',
      animation: 'slideIn 0.3s ease-out',
      fontFamily: 'sans-serif'
    }}>
      <span style={{ fontWeight: 'bold', flexGrow: 1, marginRight: '10px' }}>
        {ehErro ? '❌ ' : '✅ '} {mensagem}
      </span>
      <button 
        onClick={onFechar}
        style={{
          background: 'none',
          border: 'none',
          color: corTexto,
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px'
        }}
      >
        &times;
      </button>

      {/* Mini animação CSS inserida direto no componente */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}