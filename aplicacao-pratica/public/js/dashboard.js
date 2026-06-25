// =============================
// FUNÇÕES AUXILIARES
// =============================

function formatarMoeda(valor) {
    const numero = Number(valor) || 0;

    return numero.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

async function buscarDados(url) {
    const resposta = await fetch(url);

    if (!resposta.ok) {
        throw new Error(`Erro ao buscar dados de ${url}`);
    }

    return await resposta.json();
}


// =============================
// CARDS DO DASHBOARD
// =============================

async function carregarResumo() {
    try {
        const dados = await buscarDados('/api/dashboard/resumo');

        document.getElementById('totalVendido').textContent = formatarMoeda(dados.total_vendido);
        document.getElementById('quantidadeVendas').textContent = dados.quantidade_vendas;
        document.getElementById('ticketMedio').textContent = formatarMoeda(dados.ticket_medio);
        document.getElementById('totalClientes').textContent = dados.total_clientes;
        document.getElementById('totalProdutos').textContent = dados.total_produtos;
        document.getElementById('produtosEstoqueBaixo').textContent = dados.produtos_estoque_baixo;

    } catch (erro) {
        console.error('Erro ao carregar resumo:', erro);
    }
}


// =============================
// GRÁFICO: VENDAS POR MÊS
// =============================

async function carregarGraficoVendasMes() {
    try {
        const dados = await buscarDados('/api/dashboard/vendas-por-mes');

        const labels = dados.map(item => item.mes);
        const valores = dados.map(item => Number(item.total_vendido));

        const ctx = document.getElementById('graficoVendasMes');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total vendido',
                    data: valores
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

    } catch (erro) {
        console.error('Erro ao carregar gráfico de vendas por mês:', erro);
    }
}


// =============================
// GRÁFICO: PRODUTOS MAIS VENDIDOS
// =============================

async function carregarGraficoProdutosVendidos() {
    try {
        const dados = await buscarDados('/api/dashboard/produtos-mais-vendidos');

        const labels = dados.map(item => item.produto);
        const valores = dados.map(item => Number(item.quantidade_vendida));

        const ctx = document.getElementById('graficoProdutosVendidos');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Quantidade vendida',
                    data: valores
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });

    } catch (erro) {
        console.error('Erro ao carregar gráfico de produtos vendidos:', erro);
    }
}


// =============================
// GRÁFICO: VENDAS POR CATEGORIA
// =============================

async function carregarGraficoCategorias() {
    try {
        const dados = await buscarDados('/api/dashboard/vendas-por-categoria');

        const labels = dados.map(item => item.categoria);
        const valores = dados.map(item => Number(item.total_vendido));

        const ctx = document.getElementById('graficoCategorias');

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total vendido',
                    data: valores
                }]
            },
            options: {
                responsive: true
            }
        });

    } catch (erro) {
        console.error('Erro ao carregar gráfico de categorias:', erro);
    }
}


// =============================
// TABELA: ESTOQUE BAIXO
// =============================

async function carregarEstoqueBaixo() {
    try {
        const dados = await buscarDados('/api/dashboard/estoque-baixo');

        const tbody = document.getElementById('tabelaEstoqueBaixo');

        tbody.innerHTML = '';

        if (dados.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4">Nenhum produto com estoque baixo.</td>
                </tr>
            `;
            return;
        }

        dados.forEach(item => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${item.produto}</td>
                <td>${item.categoria}</td>
                <td>${item.estoque_atual}</td>
                <td>${item.estoque_minimo}</td>
            `;

            tbody.appendChild(tr);
        });

    } catch (erro) {
        console.error('Erro ao carregar estoque baixo:', erro);
    }
}


// =============================
// TABELA: ÚLTIMAS VENDAS
// =============================

async function carregarUltimasVendas() {
    try {
        const dados = await buscarDados('/api/dashboard/ultimas-vendas');

        const tbody = document.getElementById('tabelaUltimasVendas');

        tbody.innerHTML = '';

        if (dados.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5">Nenhuma venda encontrada.</td>
                </tr>
            `;
            return;
        }

        dados.forEach(venda => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${venda.id_venda}</td>
                <td>${venda.cliente}</td>
                <td>${venda.funcionario}</td>
                <td>${formatarMoeda(venda.valor_total)}</td>
                <td>${venda.status}</td>
            `;

            tbody.appendChild(tr);
        });

    } catch (erro) {
        console.error('Erro ao carregar últimas vendas:', erro);
    }
}


// =============================
// INICIAR DASHBOARD
// =============================

document.addEventListener('DOMContentLoaded', () => {
    carregarResumo();
    carregarGraficoVendasMes();
    carregarGraficoProdutosVendidos();
    carregarGraficoCategorias();
    carregarEstoqueBaixo();
    carregarUltimasVendas();
});