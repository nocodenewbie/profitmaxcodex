const { useState } = React;

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value || 0);

function createTool(title) {
  return function Tool() {
    const [dados, setDados] = useState([]);

    const onUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const rows = results.data.filter((r) => r.nome && r.valor);
            setDados(rows);
          },
        });
      }
    };

    const onSubmit = (e) => {
      e.preventDefault();
      const nome = e.target.nome.value;
      const valorStr = e.target.valor.value;
      const valor = parseFloat(valorStr.replace(/\./g, '').replace(',', '.'));
      setDados([...dados, { nome, valor }]);
      e.target.reset();
    };

    const downloadTemplate = () => {
      const csv = 'nome,valor\n';
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'template.csv';
      link.click();
    };

    const gerarPDF = () => {
      const doc = new jspdf.jsPDF();
      doc.text(title, 10, 10);
      let y = 20;
      dados.forEach((item) => {
        doc.text(`${item.nome} - ${formatCurrency(item.valor)}`, 10, y);
        y += 10;
      });
      doc.save(`${title}.pdf`);
    };

    return (
      <div className="tool">
        <h2>{title}</h2>
        <div>
          <h3>Upload CSV</h3>
          <input type="file" accept=".csv" onChange={onUpload} />
          <button type="button" onClick={downloadTemplate}>Baixar Template CSV</button>
        </div>
        <div>
          <h3>Entrada Manual</h3>
          <form onSubmit={onSubmit}>
            <input name="nome" placeholder="Nome" required />
            <input name="valor" placeholder="Valor" required />
            <button type="submit">Adicionar</button>
          </form>
        </div>
        <div>
          <h3>Dados</h3>
          <ul>
            {dados.map((d, i) => (
              <li key={i}>{d.nome} - {formatCurrency(d.valor)}</li>
            ))}
          </ul>
        </div>
        <button type="button" onClick={gerarPDF}>Gerar PDF</button>
      </div>
    );
  };
}

const FerramentaVendas = createTool('Controle de Vendas');
const FerramentaClientes = createTool('Cadastro de Clientes');
const FerramentaProdutos = createTool('Cadastro de Produtos');
const FerramentaMetas = createTool('Metas de Vendas');
const FerramentaDescontos = createTool('Controle de Descontos');
const FerramentaCampanhas = createTool('Gestão de Campanhas');
const FerramentaFaturamento = createTool('Análise de Faturamento');
const FerramentaDespesas = createTool('Controle de Despesas');
const FerramentaComissoes = createTool('Painel de Comissões');
const FerramentaRelatorios = createTool('Relatórios Gerais');

function App() {
  return (
    <div>
      <h1>Painel de Vendas</h1>
      <FerramentaVendas />
      <FerramentaClientes />
      <FerramentaProdutos />
      <FerramentaMetas />
      <FerramentaDescontos />
      <FerramentaCampanhas />
      <FerramentaFaturamento />
      <FerramentaDespesas />
      <FerramentaComissoes />
      <FerramentaRelatorios />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
