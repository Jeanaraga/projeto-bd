// =============================
// CONFIGURAÇÃO DOS RELATÓRIOS
// =============================

const relatorios = {
    inner: {
        titulo: 'INNER JOIN',
        descricao: 'Lista vendas que possuem cliente, funcionário e loja relacionados.',
        url: '/api/relatorios/inner-join',
        sql: `
SELECT 
    v.id_venda,
    c.nome AS cliente,
    f.nome AS funcionario,
    l.nome AS loja,
    v.data_venda,
    v.valor_total
FROM venda v
INNER JOIN cliente c 
    ON v.id_cliente = c.id_cliente
INNER JOIN funcionario f 
    ON v.id_funcionario = f.id_funcionario
INNER JOIN loja l 
    ON v.id_loja = l.id_loja
ORDER BY v.id_venda;
        `
    },

    left: {
        titulo: 'LEFT JOIN',
        descricao: 'Lista todos os clientes, inclusive os que não possuem vendas.',
        url: '/api/relatorios/left-join',
        sql: `
SELECT 
    c.id_cliente,
    c.nome AS cliente,
    v.id_venda,
    v.valor_total,
    v.status
FROM cliente c
LEFT JOIN venda v 
    ON c.id_cliente = v.id_cliente
ORDER BY c.id_cliente;
        `
    },

    right: {
        titulo: 'RIGHT JOIN',
        descricao: 'Lista todos os produtos, inclusive os que não aparecem em vendas.',
        url: '/api/relatorios/right-join',
        sql: `
SELECT 
    v.id_venda,
    p.id_produto,
    p.nome AS produto,
    iv.quantidade,
    iv.subtotal
FROM item_venda iv
RIGHT JOIN produto p 
    ON iv.id_produto = p.id_produto
LEFT JOIN venda v 
    ON iv.id_venda = v.id_venda
ORDER BY p.id_produto;
        `
    },

    full: {
        titulo: 'FULL JOIN',
        descricao: 'Mostra clientes e vendas, incluindo registros sem correspondência.',
        url: '/api/relatorios/full-join',
        sql: `
SELECT 
    c.id_cliente,
    c.nome AS cliente,
    v.id_venda,
    v.valor_total
FROM cliente c
FULL JOIN venda v 
    ON c.id_cliente = v.id_cliente
ORDER BY c.id_cliente, v.id_venda;
        `
    },

    group: {
        titulo: 'GROUP BY + HAVING',
        descricao: 'Agrupa vendas por cliente e mostra apenas quem gastou mais de R$ 100.',
        url: '/api/relatorios/group-by-having',
        sql: `
SELECT 
    c.nome AS cliente,
    COUNT(v.id_venda) AS quantidade_vendas,
    SUM(v.valor_total) AS total_gasto
FROM cliente c
INNER JOIN venda v 
    ON c.id_cliente = v.id_cliente
WHERE v.status = 'Finalizada'
GROUP BY c.nome
HAVING SUM(v.valor_total) > 100
ORDER BY total_gasto DESC;
        `
    },

    union: {
        titulo: 'UNION',
        descricao: 'Une nomes de clientes e funcionários em uma única lista.',
        url: '/api/relatorios/union',
        sql: `
SELECT nome, 'Cliente' AS tipo
FROM cliente

UNION

SELECT nome, 'Funcionário' AS tipo
FROM funcionario

ORDER BY nome;
        `
    },

    intersect: {
        titulo: 'INTERSECT',
        descricao: 'Mostra clientes que aparecem na tabela venda e também em endereço_cliente.',
        url: '/api/relatorios/intersect',
        sql: `
SELECT id_cliente
FROM venda

INTERSECT

SELECT id_cliente
FROM endereco_cliente

ORDER BY id_cliente;
        `
    },

    except: {
        titulo: 'EXCEPT',
        descricao: 'Mostra clientes cadastrados que não possuem venda.',
        url: '/api/relatorios/except',
        sql: `
SELECT id_cliente, nome
FROM cliente

EXCEPT

SELECT c.id_cliente, c.nome
FROM cliente c
INNER JOIN venda v 
    ON c.id_cliente = v.id_cliente

ORDER BY id_cliente;
        `
    },

    estoque: {
        titulo: 'Relatório de Estoque',
        descricao: 'Mostra a situação dos produtos com base no estoque atual e estoque mínimo.',
        url: '/api/relatorios/estoque',
        sql: `
SELECT 
    p.id_produto,
    p.nome AS produto,
    c.nome AS categoria,
    p.estoque_atual,
    p.estoque_minimo,
    CASE 
        WHEN p.estoque_atual <= p.estoque_minimo THEN 'Estoque Baixo'
        ELSE 'Estoque Normal'
    END AS situacao
FROM produto p
INNER JOIN categoria c 
    ON p.id_categoria = c.id_categoria
ORDER BY p.estoque_atual ASC;
        `
    }
};


// =============================
// FUNÇÕES AUXILIARES
// =============================

function formatarValor(valor) {
    if (valor === null || valor === undefined) {
        return '-';
    }

    if (typeof valor === 'number') {
        return valor;
    }

    if (!isNaN(valor) && valor !== '') {
        return valor;
    }

    if (typeof valor === 'string' && valor.includes('T')) {
        const data = new Date(valor);

        if (!isNaN(data)) {
            return data.toLocaleDateString('pt-BR');
        }
    }

    return valor;
}


async function buscarDados(url) {
    const resposta = await fetch(url);

    if (!resposta.ok) {
        throw new Error(`Erro ao buscar dados de ${url}`);
    }

    return await resposta.json();
}


function criarCabecalho(dados) {
    const thead = document.getElementById('theadResultado');

    thead.innerHTML = '';

    if (dados.length === 0) {
        thead.innerHTML = `
            <tr>
                <th>Resultado</th>
            </tr>
        `;
        return;
    }

    const colunas = Object.keys(dados[0]);

    const tr = document.createElement('tr');

    colunas.forEach(coluna => {
        const th = document.createElement('th');
        th.textContent = coluna;
        tr.appendChild(th);
    });

    thead.appendChild(tr);
}


function criarLinhas(dados) {
    const tbody = document.getElementById('tbodyResultado');

    tbody.innerHTML = '';

    if (dados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td>Nenhum registro encontrado.</td>
            </tr>
        `;
        return;
    }

    const colunas = Object.keys(dados[0]);

    dados.forEach(item => {
        const tr = document.createElement('tr');

        colunas.forEach(coluna => {
            const td = document.createElement('td');
            td.textContent = formatarValor(item[coluna]);
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
}


// =============================
// CARREGAR RELATÓRIO
// =============================

async function carregarRelatorio(tipo) {
    const relatorio = relatorios[tipo];

    if (!relatorio) {
        alert('Relatório não encontrado.');
        return;
    }

    try {
        document.getElementById('tituloRelatorio').textContent = relatorio.titulo;
        document.getElementById('descricaoRelatorio').textContent = relatorio.descricao;
        document.getElementById('sqlConsulta').textContent = relatorio.sql.trim();

        const dados = await buscarDados(relatorio.url);

        criarCabecalho(dados);
        criarLinhas(dados);

    } catch (erro) {
        console.error('Erro ao carregar relatório:', erro);

        document.getElementById('theadResultado').innerHTML = `
            <tr>
                <th>Erro</th>
            </tr>
        `;

        document.getElementById('tbodyResultado').innerHTML = `
            <tr>
                <td>Erro ao carregar relatório.</td>
            </tr>
        `;
    }
}


// =============================
// LIMPAR RESULTADO
// =============================

function limparResultado() {
    document.getElementById('tituloRelatorio').textContent = 'Resultado do relatório';

    document.getElementById('descricaoRelatorio').textContent =
        'Clique em um relatório acima para visualizar os dados.';

    document.getElementById('sqlConsulta').textContent = 'Nenhuma consulta executada.';

    document.getElementById('theadResultado').innerHTML = `
        <tr>
            <th>Resultado</th>
        </tr>
    `;

    document.getElementById('tbodyResultado').innerHTML = `
        <tr>
            <td>Nenhum relatório carregado.</td>
        </tr>
    `;
}


// =============================
// INICIAR PÁGINA
// =============================

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnLimparResultado').addEventListener('click', limparResultado);
});