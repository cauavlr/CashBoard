import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Dashboard() {
  const [bankAccount, setBankAccount] = useState(null);
  const [bankConnected, setBankConnected] = useState(false);
  const [loadingBank, setLoadingBank] = useState(false);
  const [nova, setNova] = useState({
  desc: "",
  valor: "",
  tipo: "receita",
  cat: "",
});
const handleExcluir = (id) => {
    const confirmacao = window.confirm("Deseja excluir esta transação?");
    if (!confirmacao) return;

    const atualizadas = transactions.filter((t) => t.id !== id);
    setTransactions(atualizadas);
  };

const [filtroTipo, setFiltroTipo] = useState("todas");
const [transactions, setTransactions] = useState(() => {
  const dadosSalvos = localStorage.getItem("transacoes");
  return dadosSalvos ? JSON.parse(dadosSalvos) : [
    {
      id: 1,
      description: "Supermercado",
      category: "Alimentação",
      date: "15/08/2023",
      amount: -245.9,
      icon: "fa-shopping-cart",
    },
    {
      id: 2,
      description: "Aluguel",
      category: "Moradia",
      date: "10/08/2023",
      amount: -1200.0,
      icon: "fa-home",
    },
    {
      id: 3,
      description: "Salário",
      category: "Rendimento",
      date: "05/08/2023",
      amount: 4500.0,
      icon: "fa-money-bill-wave",
    },
  ];
});

useEffect(() => {
  localStorage.setItem("transacoes", JSON.stringify(transactions));
}, [transactions]);

  const connectToBank = async () => {
    setLoadingBank(true);
    try {
      const accountInfo = await bankAPI.getAccountInfo();
      setBankAccount(accountInfo);
      setBankConnected(true);
      alert(`Conectado com sucesso ao banco!\nTitular: ${accountInfo.titular}\nAgência: ${accountInfo.agencia}\nConta: ${accountInfo.numero}`);
    } catch (error) {
      alert('Erro ao conectar com o banco: ' + error.message);
    } finally {
      setLoadingBank(false);
    }
  };
  const importTransactionsFromBank = async () => {
    if (!bankConnected) {
      alert('Conecte-se ao banco primeiro!');
      return;
    }
    setLoadingBank(true);
    try {
      const bankTransactions = await importBankTransactions();
      const existingIds = new Set(transactions.map(t => t.id));
      const newTransactions = bankTransactions.filter(t => !existingIds.has(t.id));
      
      if (newTransactions.length > 0) {
        setTransactions([...newTransactions, ...transactions]);
        alert(`${newTransactions.length} transações importadas do banco!`);
      } else {
        alert('Nenhuma nova transação encontrada.');
      }
    } catch (error) {
      alert('Erro ao importar transações: ' + error.message);
    } finally {
      setLoadingBank(false);
    }
  };
  const disconnectFromBank = () => {
    setBankAccount(null);
    setBankConnected(false);
    alert('Desconectado do banco com sucesso!');
  };


  const saldoAtual = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalReceitas = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);
  const totalDespesas = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

    const handleAddTransaction = () => {
  const novaTransacao = {
    id: Date.now(),
    description: nova.desc,
    amount:
  nova.tipo === "despesa"
    ? -parseFloat(nova.valor.replace(/[^\d,-]/g, "").replace(",", "."))
    : parseFloat(nova.valor.replace(/[^\d,-]/g, "").replace(",", ".")),
    category: nova.cat,
    date: new Date().toLocaleDateString("pt-BR"),
    icon:
      nova.tipo === "despesa"
        ? "fa-minus-circle"
        : "fa-plus-circle",
  };

  setTransactions([novaTransacao, ...transactions]);
  setNova({ desc: "", valor: "", tipo: "receita", cat: "" });

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("modalTransacao")
  );
  modal.hide();
};
const transacoesFiltradas = transactions.filter((t) => {
  if (filtroTipo === "todas") return true;
  if (filtroTipo === "receita") return t.amount > 0;
  if (filtroTipo === "despesa") return t.amount < 0;
  return true;
});

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex flex-column flex-md-row p-0">
      {}
      <aside className="bg-white shadow-sm p-3" style={{ width: "250px" }}>
        <div className="d-flex align-items-center border-bottom pb-3 mb-3">
          <img
            src="https://placehold.co/40x40"
            alt="Logo Site"
            className="rounded-circle me-2"
          />
          <h1 className="h5 text-primary mb-0">site</h1>
        </div>
        <nav>
          <ul className="nav flex-column gap-2">
            <li className="nav-item">
              <a
                href="#"
                className="nav-link d-flex align-items-center rounded active"
                style={{ backgroundColor: "#eef2ff", color: "#4f46e5" }}
              >
                <i className="fas fa-home me-2"></i> Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link d-flex align-items-center rounded">
                <i className="fas fa-wallet me-2"></i> Transações
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link d-flex align-items-center rounded">
                <i className="fas fa-chart-pie me-2"></i> Orçamentos
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link d-flex align-items-center rounded">
                <i className="fas fa-tags me-2"></i> Categorias
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link d-flex align-items-center rounded">
                <i className="fas fa-bell me-2"></i> Alertas
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link d-flex align-items-center rounded">
                <i className="fas fa-cog me-2"></i> Configurações
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {}
      <main className="flex-grow-1 p-4">
        {}
        <header className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h4">Dashboard Financeiro</h2>
          <div className="d-flex align-items-center gap-3">
            {/* Botões de integração bancária */}
            {!bankConnected ? (
              <button
                className="btn btn-success d-flex align-items-center"
                onClick={connectToBank}
                disabled={loadingBank}
              >
                <i className={`fas ${loadingBank ? 'fa-spinner fa-spin' : 'fa-university'} me-2`}></i>
                {loadingBank ? 'Conectando...' : 'Conectar Banco'}
              </button>
             ) : (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-info d-flex align-items-center"
                  onClick={importTransactionsFromBank}
                  disabled={loadingBank}
                >
                  <i className={`fas ${loadingBank ? 'fa-spinner fa-spin' : 'fa-download'} me-2`}></i>
                  {loadingBank ? 'Importando...' : 'Importar Transações'}
                </button>
                <button
                  className="btn btn-outline-secondary d-flex align-items-center"
                  onClick={disconnectFromBank}
                >
                  <i className="fas fa-unlink me-2"></i>
                  Desconectar
                </button>
              </div>
            )}

            <button className="btn btn-primary d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#modaalTransacao">
              <i className="fas fa-plus me-2"></i>
              </button>          
            <div className="position-relative">
              <i className="fas fa-bell text-secondary fs-4"></i>
              <span
                className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                style={{ width: "8px", height: "8px" }}
              ></span>
            </div>
            <div className="d-flex align-items-center">
              <img
                src="https://placehold.co/40x40"
                alt="Perfil"
                className="rounded-circle"
                style={{ width: "32px", height: "32px" }}
              />
              <span className="ms-2 fw-medium">Olá, Caua</span>
            </div>
          </div>
        </header>
        {/* Modal de Nova Transação */}
<div
  className="modal fade"
  id="modalTransacao"
  tabIndex="-1"
  aria-labelledby="modalTransacaoLabel"
  aria-hidden="true"
>
  <div className="modal-dialog">
    <div className="modal-content">
      <form
        onSubmit={(e  ) => {
          e.preventDefault();
          handleAddTransaction();
        }}
      >
        <div className="modal-header">
          <h5 className="modal-title" id="modalTransacaoLabel">
            Nova Transação
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Fechar"
          ></button>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label">Descrição</label>
            <input
              type="text"
              className="form-control"
              value={nova.desc}
              onChange={(e) => setNova({ ...nova, desc: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Valor</label>
            <input type="text" className="form-control" value={nova.valor} onChange={(e) => {
              const raw = e.target.value.replace(/[^\d,-]/g, "");
              const centavos = parseFloat(raw) / 100;
                  const formatado = centavos.toLocaleString("pt-BR", { 
                    style: "currency",
                    currency: "BRL",
                  });
                  setNova({ ...nova, valor: formatado });
                }}
                required
                />
          </div>
          <div className="mb-3">
            <label className="form-label">Tipo</label>
            <select
              className="form-select"
              value={nova.tipo}
              onChange={(e) => setNova({ ...nova, tipo: e.target.value })}
              required
            >
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Categoria</label>
            <input
              type="text"
              className="form-control"
              value={nova.cat}
              onChange={(e) => setNova({ ...nova, cat: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="modal-footer">
          <button type="submit" className="btn btn-success">
            Adicionar
          </button>
        </div>
      </form>
    </div>
  </div>
</div>


        {}
        {/* Card de informações do banco conectado */}
        {bankConnected && bankAccount && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card shadow-sm border-success">
                <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="fas fa-university me-2"></i>
                    Banco Conectado
                  </h5>
                  <span className="badge bg-light text-success">Ativo</span>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3">
                      <p className="mb-1 text-muted">Titular</p>
                      <p className="fw-bold">{bankAccount.titular}</p>
                    </div>
                    <div className="col-md-3">
                      <p className="mb-1 text-muted">Agência</p>
                      <p className="fw-bold">{bankAccount.agencia}</p>
                    </div>
                    <div className="col-md-3">
                      <p className="mb-1 text-muted">Conta</p>
                      <p className="fw-bold">{bankAccount.numero}</p>
                    </div>
                    <div className="col-md-3">
                      <p className="mb-1 text-muted">Tipo</p>
                      <p className="fw-bold">{bankAccount.tipo}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row mb-4 g-3">
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card shadow-sm">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 text-muted">Saldo Atual</p>
                  <p className="h4 fw-bold">
                    R$ {saldoAtual.toFixed(2).replace(".", ",")}
                  </p>
                </div>
                <div className="p-3 rounded bg-success bg-opacity-10 text-success">
                  <i className="fas fa-wallet fs-4"></i>
                </div>
              </div>
              <div className="card-footer d-flex align-items-center text-success small">
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="card shadow-sm">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 text-muted">Receitas</p>
                  <p className="h4 fw-bold text-success">
                    R$ {totalReceitas.toFixed(2).replace(".", ",")}
                  </p>
                </div>
                <div className="p-3 rounded bg-primary bg-opacity-10 text-primary">
                  <i className="fas fa-arrow-down fs-4"></i>
                </div>
              </div>
              <div className="card-footer d-flex align-items-center text-success small">
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="card shadow-sm">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 text-muted">Despesas</p>
                  <p className="h4 fw-bold text-danger">
                    R$ {Math.abs(totalDespesas).toFixed(2).replace(".", ",")}
                  </p>
                </div>
                <div className="p-3 rounded bg-danger bg-opacity-10 text-danger">
                  <i className="fas fa-arrow-up fs-4"></i>
                </div>
              </div>
              <div className="card-footer d-flex align-items-center text-success small">
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="card shadow-sm">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 text-muted">Meta Mensal</p>
                  <p className="h4 fw-bold">75%</p>
                </div>
                <div className="p-3 rounded bg-purple bg-opacity-10 text-purple">
                  <i className="fas fa-bullseye fs-4"></i>
                </div>
              </div>
              <div className="card-footer">
                <div className="progress" style={{ height: "8px" }}>
                  <div
                    className="progress-bar bg-purple"
                    role="progressbar"
                    style={{ width: "75%" }}
                    aria-valuenow="75"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3 className="h5 mb-0">Transações Recentes</h3>
            <a href="#" className="text-decoration-none">
              Ver todas
            </a>
          </div>
          
          <div className="d-flex justify-content-end mb-2">
  <select
    className="form-select w-auto"
    value={filtroTipo}
    onChange={(e) => setFiltroTipo(e.target.value)}
  >
    <option value="todas">Todas</option>
    <option value="receita">Receitas</option>
    <option value="despesa">Despesas</option>
  </select>
</div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
  <tr>
    <th>Descrição</th>
    <th>Categoria</th>
    <th>Data</th>
    <th className="text-end">Valor</th>
    <th className="text-end">Ações</th>
  </tr>
</thead>
  <tbody>
    {transacoesFiltradas.map((t) => (
      <tr key={t.id}>
      <td className="d-flex align-items-center gap-2">
      <span className={`rounded-circle d-inline-flex justify-content-center align-items-center`}
       style={{
        width: "32px",
        height: "32px",
        backgroundColor:
        t.amount > 0 ? "#d1e7dd" : "#f8d7da",
        color: t.amount > 0 ? "#0f5132" : "#842029",
       }}>
        <i className={`fas ${t.icon}`}></i>
      </span>
                   {t.description}
                    </td>
                    <td>{t.category}</td>
                    <td>{t.date}</td>
                    <td
                      className={`text-end ${
                        t.amount > 0 ? "text-success" : "text-danger"
                      }`}
                    >
                      R$ {t.amount.toFixed(2).replace(".", ",")}
                    </td>
                    <td className="text-end">
  <button
    className="btn btn-sm btn-outline-danger"
    onClick={() => handleExcluir(t.id)}
  >
    <i className="fas fa-trash-alt"></i>
  </button>
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
