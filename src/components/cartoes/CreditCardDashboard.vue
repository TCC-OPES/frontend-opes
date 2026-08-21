import React from 'react';
import { CreditCard, Plus, HelpCircle } from 'lucide-react';

function CardItem({ card }) {
  const percentage = card.limit > 0 
    ? Math.min(100, (card.usedAmount / card.limit) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
      <div className={`${card.bgColor || 'bg-slate-700'} text-white p-5 space-y-4`}>
        <div>
          <p className="text-xs font-normal opacity-80">{card.bankName}</p>
          <h3 className="text-lg font-bold tracking-tight">{card.title}</h3>
        </div>

        <p className="text-sm font-mono tracking-widest pt-1">
          {card.lastDigits ? `**** **** **** ${card.lastDigits}` : '**** **** **** ****'}
        </p>

        <div className="flex justify-between items-end pt-2">
          <div>
            <span className="block text-[10px] uppercase tracking-wider opacity-75">
              Vencimento
            </span>
            <span className="text-sm font-bold">{card.dueDate}</span>
          </div>
          <CreditCard className="w-6 h-6 opacity-90" />

      <div className="p-4 space-y-2 bg-white">
        <div className="flex justify-between text-xs text-slate-500 font-medium">
          <span>Limite utilizado</span>
          <span className="font-bold text-slate-800">
            {percentage.toFixed(1)}%
          </span>
        </div>

        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#00701a] h-full rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-slate-400 font-medium pt-1">
          <span>R$ {(card.usedAmount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          <span>R$ {(card.limit || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
  );
}

// Subcomponente 2: Item da Transação
function TransactionItem({ transaction }) {
  return (
    <div className="flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-50 rounded-xl transition-colors">
      <div className="flex items-center space-x-3.5">
        <div className="bg-blue-50 p-2.5 rounded-lg text-blue-500 flex items-center justify-center">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800">{transaction.description}</h4>
          <p className="text-xs text-slate-400 font-medium">
            {transaction.cardName} • {transaction.date} {transaction.installments ? `• ${transaction.installments}` : ''}
          </p>
        </div>
      
      <span className="text-sm font-bold text-blue-600">
        R$ {(transaction.amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </span>
  );
}

// Componente Principal
export default function CreditCardDashboard({ cards = [], transactions = [] }) {
  return (
    <div className="min-h-screen bg-[#f4f6f8] p-6 text-slate-800 font-sans relative">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Grade de Cartões */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {!cards || cards.length === 0 ? (
            <div className="col-span-full bg-white p-6 rounded-xl text-center text-slate-400 border border-dashed border-slate-300">
              Nenhum cartão cadastrado.
            </div>
          ) : (
            cards.map((card) => (
              <CardItem key={card.id || card.title} card={card} />
            ))
          )}

        {/* Lista de Transações */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-base font-bold text-slate-800">Transações Recentes</h2>

          <div className="space-y-3">
            {!transactions || transactions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                Nenhuma transação recente encontrada.
              </p>
            ) : (
              transactions.map((tx) => (
                <TransactionItem key={tx.id || tx.description} transaction={tx} />
              ))
            )}
          </div>


      
      <div className="fixed bottom-6 right-6 flex flex-col items-center space-y-3">
        <button
          aria-label="Adicionar transação"
          className="w-12 h-12 bg-[#005260] hover:bg-[#003d48] text-white rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </button>
        <button
          aria-label="Ajuda"
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
  );
}