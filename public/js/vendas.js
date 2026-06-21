// =============================
// VARIÁVEIS GLOBAIS
// =============================

let produtosDisponiveis = [];
let itensVenda = [];


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

function formatarData(data) {
    if (!data) {
        return '-';
    }

    return new Date(data).toLocaleDateString('pt-BR');
}

async function buscarDados(url) {
    const resposta = await fetch(url);

    if (!resposta.ok) {
        throw new Error(`Erro ao buscar dados de ${url}`);
    }

    return await resposta.json();
}

function mostrarMensagem(texto) {
    alert(texto);
}

function preencherSelect(selectId, lista, campoId, campoNome) {
    const select = document.getElementById(selectId);

    select.innerHTML = '<option value="">Selecione...</option>';

    lista.forEach(item => {
        const option = document.createElement('option');

        option.value = item[campoId];
        option.textContent = item[campoNome];

        select.appendChild(option);
    });
}


// =============================
// CARREGAR DADOS DO FORMULÁRIO
// =============================

async function carregarDadosFormulario() {
    try {
        const dados = await buscarDados('/api/vendas/dados-formulario');

        preencherSelect('idCliente', dados.clientes, 'id_cliente', 'nome');
        preencherSelect('idFuncionario', dados.funcionarios, 'id_funcionario', 'nome');
        preencherSelect('idLoja', dados.lojas, 'id_loja', 'nome');

        produtosDisponiveis = dados.produtos;

        const selectProduto = document.getElementById('idProduto');

        selectProduto.innerHTML = '<option value="">Selecione...</option>';

        produtosDisponiveis.forEach(produto => {
            const option = document.createElement('option');

            option.value = produto.id_produto;
            option.textContent = `${produto.nome} - ${formatarMoeda(produto.preco_venda)} | Estoque: ${produto.estoque_atual}`;

            selectProduto.appendChild(option);
        });

    } catch (erro) {
        console.error('Erro ao carregar dados do formulário:', erro);
        mostrarMensagem('Erro ao carregar dados do formulário de venda.');
    }
}


// =============================
// ADICIONAR ITEM NA VENDA
// =============================

function adicionarItemVenda() {
    const idProduto = Number(document.getElementById('idProduto').value);
    const quantidade = Number(document.getElementById('quantidade').value);
    const desconto = Number(document.getElementById('desconto').value) || 0;

    if (!idProduto) {
        mostrarMensagem('Selecione um produto.');
        return;
    }

    if (quantidade <= 0) {
        mostrarMensagem('A quantidade deve ser maior que zero.');
        return;
    }

    if (desconto < 0) {
        mostrarMensagem('O desconto não pode ser negativo.');
        return;
    }

    const produto = produtosDisponiveis.find(p => Number(p.id_produto) === idProduto);

    if (!produto) {
        mostrarMensagem('Produto não encontrado.');
        return;
    }

    if (quantidade > Number(produto.estoque_atual)) {
        mostrarMensagem(`Estoque insuficiente. Estoque disponível: ${produto.estoque_atual}`);
        return;
    }

    const itemJaExiste = itensVenda.find(item => item.id_produto === idProduto);

    if (itemJaExiste) {
        mostrarMensagem('Esse produto já foi adicionado. Remova o item e adicione novamente.');
        return;
    }

    const precoUnitario = Number(produto.preco_venda);
    const subtotal = (precoUnitario * quantidade) - desconto;

    if (subtotal < 0) {
        mostrarMensagem('O desconto não pode ser maior que o valor do produto.');
        return;
    }

    const item = {
        id_produto: idProduto,
        nome: produto.nome,
        preco_unitario: precoUnitario,
        quantidade,
        desconto,
        subtotal
    };

    itensVenda.push(item);

    atualizarTabelaItens();
    limparCamposItem();
}


// =============================
// ATUALIZAR TABELA DE ITENS
// =============================

function atualizarTabelaItens() {
    const tbody = document.getElementById('tabelaItensVenda');

    tbody.innerHTML = '';

    if (itensVenda.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6">Nenhum item adicionado.</td>
            </tr>
        `;

        atualizarTotalVenda();
        return;
    }

    itensVenda.forEach((item, index) => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${item.nome}</td>
            <td>${formatarMoeda(item.preco_unitario)}</td>
            <td>${item.quantidade}</td>
            <td>${formatarMoeda(item.desconto)}</td>
            <td>${formatarMoeda(item.subtotal)}</td>
            <td>
                <button type="button" class="btn-small btn-delete" onclick="removerItemVenda(${index})">
                    Remover
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });

    atualizarTotalVenda();
}


// =============================
// REMOVER ITEM
// =============================

function removerItemVenda(index) {
    itensVenda.splice(index, 1);
    atualizarTabelaItens();
}


// =============================
// ATUALIZAR TOTAL
// =============================

function atualizarTotalVenda() {
    const total = itensVenda.reduce((soma, item) => soma + Number(item.subtotal), 0);

    document.getElementById('valorTotalVenda').textContent = formatarMoeda(total);
}


// =============================
// LIMPAR CAMPOS DE ITEM
// =============================

function limparCamposItem() {
    document.getElementById('idProduto').value = '';
    document.getElementById('quantidade').value = 1;
    document.getElementById('desconto').value = 0;
}


// =============================
// FINALIZAR VENDA
// =============================

async function finalizarVenda(event) {
    event.preventDefault();

    const idCliente = Number(document.getElementById('idCliente').value);
    const idFuncionario = Number(document.getElementById('idFuncionario').value);
    const idLoja = Number(document.getElementById('idLoja').value);
    const formaPagamento = document.getElementById('formaPagamento').value;

    if (!idCliente) {
        mostrarMensagem('Selecione um cliente.');
        return;
    }

    if (!idFuncionario) {
        mostrarMensagem('Selecione um funcionário.');
        return;
    }

    if (!idLoja) {
        mostrarMensagem('Selecione uma loja.');
        return;
    }

    if (!formaPagamento) {
        mostrarMensagem('Selecione a forma de pagamento.');
        return;
    }

    if (itensVenda.length === 0) {
        mostrarMensagem('Adicione pelo menos um item na venda.');
        return;
    }

    const venda = {
        id_cliente: idCliente,
        id_funcionario: idFuncionario,
        id_loja: idLoja,
        forma_pagamento: formaPagamento,
        itens: itensVenda.map(item => ({
            id_produto: item.id_produto,
            quantidade: item.quantidade,
            desconto: item.desconto
        }))
    };

    try {
        const resposta = await fetch('/api/vendas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(venda)
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.erro || 'Erro ao finalizar venda.');
        }

        mostrarMensagem(`Venda finalizada com sucesso! Total: ${formatarMoeda(dados.valor_total)}`);

        limparVendaCompleta();
        carregarDadosFormulario();
        carregarVendas();

    } catch (erro) {
        console.error('Erro ao finalizar venda:', erro);
        mostrarMensagem(erro.message);
    }
}


// =============================
// LIMPAR VENDA COMPLETA
// =============================

function limparVendaCompleta() {
    document.getElementById('formVenda').reset();

    itensVenda = [];

    atualizarTabelaItens();
    atualizarTotalVenda();

    document.getElementById('quantidade').value = 1;
    document.getElementById('desconto').value = 0;
}


// =============================
// LISTAR VENDAS
// =============================

async function carregarVendas() {
    try {
        const vendas = await buscarDados('/api/vendas');

        const tbody = document.getElementById('tabelaVendas');

        tbody.innerHTML = '';

        if (vendas.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9">Nenhuma venda cadastrada.</td>
                </tr>
            `;
            return;
        }

        vendas.forEach(venda => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${venda.id_venda}</td>
                <td>${formatarData(venda.data_venda)}</td>
                <td>${venda.cliente}</td>
                <td>${venda.funcionario}</td>
                <td>${venda.loja}</td>
                <td>${venda.forma_pagamento}</td>
                <td>${formatarMoeda(venda.valor_total)}</td>
                <td>
                    <span class="${venda.status === 'Finalizada' ? 'badge-success' : 'badge-danger'}">
                        ${venda.status}
                    </span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn-small btn-edit" onclick="verDetalhesVenda(${venda.id_venda})">
                            Detalhes
                        </button>

                        <button class="btn-small btn-delete" onclick="cancelarVenda(${venda.id_venda})">
                            Cancelar
                        </button>
                    </div>
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (erro) {
        console.error('Erro ao carregar vendas:', erro);

        document.getElementById('tabelaVendas').innerHTML = `
            <tr>
                <td colspan="9">Erro ao carregar vendas.</td>
            </tr>
        `;
    }
}


// =============================
// VER DETALHES DA VENDA
// =============================

async function verDetalhesVenda(idVenda) {
    try {
        const dados = await buscarDados(`/api/vendas/${idVenda}`);

        const boxDetalhes = document.getElementById('boxDetalhesVenda');
        const infoVenda = document.getElementById('infoVenda');
        const tbody = document.getElementById('tabelaDetalhesItens');

        const venda = dados.venda;
        const itens = dados.itens;

        infoVenda.innerHTML = `
            <p><strong>ID:</strong> ${venda.id_venda}</p>
            <p><strong>Data:</strong> ${formatarData(venda.data_venda)}</p>
            <p><strong>Cliente:</strong> ${venda.cliente}</p>
            <p><strong>Funcionário:</strong> ${venda.funcionario}</p>
            <p><strong>Loja:</strong> ${venda.loja}</p>
            <p><strong>Pagamento:</strong> ${venda.forma_pagamento}</p>
            <p><strong>Status:</strong> ${venda.status}</p>
            <p><strong>Total:</strong> ${formatarMoeda(venda.valor_total)}</p>
        `;

        tbody.innerHTML = '';

        if (itens.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5">Nenhum item encontrado.</td>
                </tr>
            `;
        } else {
            itens.forEach(item => {
                const tr = document.createElement('tr');

                tr.innerHTML = `
                    <td>${item.produto}</td>
                    <td>${item.quantidade}</td>
                    <td>${formatarMoeda(item.preco_unitario)}</td>
                    <td>${formatarMoeda(item.desconto)}</td>
                    <td>${formatarMoeda(item.subtotal)}</td>
                `;

                tbody.appendChild(tr);
            });
        }

        boxDetalhes.style.display = 'block';

        boxDetalhes.scrollIntoView({
            behavior: 'smooth'
        });

    } catch (erro) {
        console.error('Erro ao buscar detalhes da venda:', erro);
        mostrarMensagem('Erro ao buscar detalhes da venda.');
    }
}


// =============================
// FECHAR DETALHES
// =============================

function fecharDetalhesVenda() {
    document.getElementById('boxDetalhesVenda').style.display = 'none';
}


// =============================
// CANCELAR VENDA
// =============================

async function cancelarVenda(idVenda) {
    const confirmar = confirm('Tem certeza que deseja cancelar esta venda? O estoque será devolvido.');

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(`/api/vendas/${idVenda}/cancelar`, {
            method: 'PATCH'
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.erro || 'Erro ao cancelar venda.');
        }

        mostrarMensagem(dados.mensagem);

        carregarDadosFormulario();
        carregarVendas();

    } catch (erro) {
        console.error('Erro ao cancelar venda:', erro);
        mostrarMensagem(erro.message);
    }
}


// =============================
// INICIAR PÁGINA
// =============================

document.addEventListener('DOMContentLoaded', () => {
    carregarDadosFormulario();
    carregarVendas();

    document.getElementById('btnAdicionarItem').addEventListener('click', adicionarItemVenda);

    document.getElementById('formVenda').addEventListener('submit', finalizarVenda);

    document.getElementById('btnLimparVenda').addEventListener('click', limparVendaCompleta);

    document.getElementById('btnRecarregarVendas').addEventListener('click', carregarVendas);

    document.getElementById('btnFecharDetalhes').addEventListener('click', fecharDetalhesVenda);
});