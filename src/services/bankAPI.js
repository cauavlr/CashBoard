// src/services/bankAPI.js
// Serviço para integração com a API mock bancária
const API_BASE_URL = 'https://5000-icyzfrol6yffs3kctzzqw-cefea463.manusvm.computer/api/bank';

export const bankAPI = {
  // Buscar informações da conta
  async getAccountInfo( ) {
    try {
      const response = await fetch(`${API_BASE_URL}/conta`);
      if (!response.ok) throw new Error('Erro ao buscar dados da conta');
      return await response.json();
    } catch (error) {
      console.error('Erro na API de conta:', error);
      throw error;
    }
  },

  // Buscar transações
  async getTransactions(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('start_date', filters.startDate);
      if (filters.endDate) params.append('end_date', filters.endDate);
      if (filters.category) params.append('category', filters.category);

      const url = `${API_BASE_URL}/transacoes${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Erro ao buscar transações');
      return await response.json();
    } catch (error) {
      console.error('Erro na API de transações:', error);
      throw error;
    }
  },

  // Buscar saldo atual
  async getBalance() {
    try {
      const response = await fetch(`${API_BASE_URL}/saldo`);
      if (!response.ok) throw new Error('Erro ao buscar saldo');
      return await response.json();
    } catch (error) {
      console.error('Erro na API de saldo:', error);
      throw error;
    }
  },

  // Buscar extrato completo
  async getStatement() {
    try {
      const response = await fetch(`${API_BASE_URL}/extrato`);
      if (!response.ok) throw new Error('Erro ao buscar extrato');
      return await response.json();
    } catch (error) {
      console.error('Erro na API de extrato:', error);
      throw error;
    }
  },

  // Buscar categorias disponíveis
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias`);
      if (!response.ok) throw new Error('Erro ao buscar categorias');
      return await response.json();
    } catch (error) {
      console.error('Erro na API de categorias:', error);
      throw error;
    }
  }
};

// Função para converter transações da API mock para o formato do projeto
export const convertBankTransactionToLocal = (bankTransaction) => {
  return {
    id: bankTransaction.id,
    description: bankTransaction.descricao,
    category: bankTransaction.categoria,
    date: new Date(bankTransaction.data).toLocaleDateString('pt-BR'),
    amount: bankTransaction.valor,
    icon: bankTransaction.valor > 0 ? 'fa-plus-circle' : 'fa-minus-circle'
  };
};

// Função para importar transações do banco mock
export const importBankTransactions = async () => {
  try {
    const bankTransactions = await bankAPI.getTransactions();
    return bankTransactions.map(convertBankTransactionToLocal);
  } catch (error) {
    console.error('Erro ao importar transações do banco:', error);
    throw error;
  }
};
