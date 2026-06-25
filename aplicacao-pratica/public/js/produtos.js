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

function mostrarMensagem(texto) {
    alert(texto);
}


// =============================
// CARREGAR CATEGORIAS
// =============================

async function carregarCategorias() {
    try {
        const categorias = await buscarDados('/api/produtos/categorias');

        const select = document.getElementById('idCategoria');

        select.innerHTML = '<option value="">Selecione...</option>';

        categorias.forEach(categoria => {
            const option = document.createElement('option');

            option.value = categoria.id_categoria;
            option.textContent = categoria.nome;

            select.appendChild(option);
        });

    } catch (erro) {
        console.error('Erro ao carregar categorias:', erro);
        mostrarMensagem('Erro ao carregar categorias.');
    }
}


// =============================
// LISTAR PRODUTOS
// =============================

async function carregarProdutos() {
    try {
        const produtos = await buscarDados('/api/produtos');

        const tbody = document.getElementById('tabelaProdutos');

        tbody.innerHTML = '';

        if (produtos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8">Nenhum produto cadastrado.</td>
                </tr>
            `;
            return;
        }

        produtos.forEach(produto => {
            const tr = document.createElement('tr');

            const estoqueBaixo = Number(produto.estoque_atual) <= Number(produto.estoque_minimo);

            tr.innerHTML = `
                <td>${produto.id_produto}</td>
                <td>${produto.nome}</td>
                <td>${produto.categoria}</td>
                <td>${formatarMoeda(produto.preco_venda)}</td>
                <td>
                    <span class="${estoqueBaixo ? 'badge-danger' : 'badge-success'}">
                        ${produto.estoque_atual}
                    </span>
                </td>
                <td>${produto.estoque_minimo}</td>
                <td>
                    <span class="${produto.status === 'Ativo' ? 'badge-success' : 'badge-danger'}">
                        ${produto.status}
                    </span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn-small btn-edit" onclick="prepararEdicao(${produto.id_produto})">
                            Editar
                        </button>

                        <button class="btn-small btn-delete" onclick="inativarProduto(${produto.id_produto})">
                            Inativar
                        </button>
                    </div>
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (erro) {
        console.error('Erro ao carregar produtos:', erro);

        document.getElementById('tabelaProdutos').innerHTML = `
            <tr>
                <td colspan="8">Erro ao carregar produtos.</td>
            </tr>
        `;
    }
}


// =============================
// CADASTRAR OU ATUALIZAR PRODUTO
// =============================

async function salvarProduto(event) {
    event.preventDefault();

    const idProduto = document.getElementById('idProduto').value;

    const produto = {
        nome: document.getElementById('nome').value.trim(),
        preco_venda: Number(document.getElementById('precoVenda').value),
        estoque_atual: Number(document.getElementById('estoqueAtual').value),
        estoque_minimo: Number(document.getElementById('estoqueMinimo').value),
        status: document.getElementById('status').value,
        id_categoria: Number(document.getElementById('idCategoria').value)
    };

    if (!produto.nome) {
        mostrarMensagem('Informe o nome do produto.');
        return;
    }

    if (produto.preco_venda <= 0) {
        mostrarMensagem('O preço precisa ser maior que zero.');
        return;
    }

    if (produto.estoque_atual < 0 || produto.estoque_minimo < 0) {
        mostrarMensagem('O estoque não pode ser negativo.');
        return;
    }

    if (!produto.id_categoria) {
        mostrarMensagem('Selecione uma categoria.');
        return;
    }

    try {
        let url = '/api/produtos';
        let metodo = 'POST';

        if (idProduto) {
            url = `/api/produtos/${idProduto}`;
            metodo = 'PUT';
        }

        const resposta = await fetch(url, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produto)
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.erro || 'Erro ao salvar produto');
        }

        mostrarMensagem(dados.mensagem);
        limparFormulario();
        carregarProdutos();

    } catch (erro) {
        console.error('Erro ao salvar produto:', erro);
        mostrarMensagem(erro.message);
    }
}


// =============================
// PREPARAR EDIÇÃO
// =============================

async function prepararEdicao(id) {
    try {
        const produto = await buscarDados(`/api/produtos/${id}`);

        document.getElementById('idProduto').value = produto.id_produto;
        document.getElementById('nome').value = produto.nome;
        document.getElementById('precoVenda').value = produto.preco_venda;
        document.getElementById('estoqueAtual').value = produto.estoque_atual;
        document.getElementById('estoqueMinimo').value = produto.estoque_minimo;
        document.getElementById('status').value = produto.status;
        document.getElementById('idCategoria').value = produto.id_categoria;

        document.getElementById('tituloFormulario').textContent = 'Editar produto';
        document.getElementById('btnSalvar').textContent = 'Atualizar';

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    } catch (erro) {
        console.error('Erro ao buscar produto:', erro);
        mostrarMensagem('Erro ao carregar produto para edição.');
    }
}


// =============================
// INATIVAR PRODUTO
// =============================

async function inativarProduto(id) {
    const confirmar = confirm('Tem certeza que deseja inativar este produto?');

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(`/api/produtos/${id}/inativar`, {
            method: 'PATCH'
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.erro || 'Erro ao inativar produto');
        }

        mostrarMensagem(dados.mensagem);
        carregarProdutos();

    } catch (erro) {
        console.error('Erro ao inativar produto:', erro);
        mostrarMensagem(erro.message);
    }
}


// =============================
// LIMPAR FORMULÁRIO
// =============================

function limparFormulario() {
    document.getElementById('formProduto').reset();
    document.getElementById('idProduto').value = '';

    document.getElementById('tituloFormulario').textContent = 'Cadastrar produto';
    document.getElementById('btnSalvar').textContent = 'Cadastrar';

    document.getElementById('status').value = 'Ativo';
}


// =============================
// INICIAR PÁGINA
// =============================

document.addEventListener('DOMContentLoaded', () => {
    carregarCategorias();
    carregarProdutos();

    document.getElementById('formProduto').addEventListener('submit', salvarProduto);

    document.getElementById('btnLimpar').addEventListener('click', limparFormulario);

    document.getElementById('btnRecarregar').addEventListener('click', carregarProdutos);
});