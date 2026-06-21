const pool = require('../db');

// 1. Resumo geral do dashboard
exports.resumoDashboard = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT
                (SELECT COALESCE(SUM(valor_total), 0) 
                 FROM venda 
                 WHERE status = 'Finalizada') AS total_vendido,

                (SELECT COUNT(*) 
                 FROM venda 
                 WHERE status = 'Finalizada') AS quantidade_vendas,

                (SELECT COALESCE(AVG(valor_total), 0) 
                 FROM venda 
                 WHERE status = 'Finalizada') AS ticket_medio,

                (SELECT COUNT(*) 
                 FROM cliente) AS total_clientes,

                (SELECT COUNT(*) 
                 FROM produto) AS total_produtos,

                (SELECT COUNT(*) 
                 FROM produto 
                 WHERE estoque_atual <= estoque_minimo) AS produtos_estoque_baixo;
        `);

        res.json(resultado.rows[0]);
    } catch (erro) {
        console.error('Erro no resumo do dashboard:', erro);
        res.status(500).json({ erro: 'Erro ao buscar resumo do dashboard' });
    }
};


// 2. Vendas por mês
exports.vendasPorMes = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT 
                TO_CHAR(data_venda, 'MM/YYYY') AS mes,
                SUM(valor_total) AS total_vendido,
                COUNT(*) AS quantidade_vendas
            FROM venda
            WHERE status = 'Finalizada'
            GROUP BY TO_CHAR(data_venda, 'MM/YYYY')
            ORDER BY MIN(data_venda);
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro em vendas por mês:', erro);
        res.status(500).json({ erro: 'Erro ao buscar vendas por mês' });
    }
};


// 3. Produtos mais vendidos
exports.produtosMaisVendidos = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT 
                p.nome AS produto,
                SUM(iv.quantidade) AS quantidade_vendida,
                SUM(iv.subtotal) AS total_faturado
            FROM item_venda iv
            INNER JOIN produto p 
                ON iv.id_produto = p.id_produto
            INNER JOIN venda v 
                ON iv.id_venda = v.id_venda
            WHERE v.status = 'Finalizada'
            GROUP BY p.nome
            ORDER BY quantidade_vendida DESC
            LIMIT 10;
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro em produtos mais vendidos:', erro);
        res.status(500).json({ erro: 'Erro ao buscar produtos mais vendidos' });
    }
};


// 4. Vendas por categoria
exports.vendasPorCategoria = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT 
                c.nome AS categoria,
                SUM(iv.quantidade) AS quantidade_vendida,
                SUM(iv.subtotal) AS total_vendido
            FROM item_venda iv
            INNER JOIN produto p 
                ON iv.id_produto = p.id_produto
            INNER JOIN categoria c 
                ON p.id_categoria = c.id_categoria
            INNER JOIN venda v 
                ON iv.id_venda = v.id_venda
            WHERE v.status = 'Finalizada'
            GROUP BY c.nome
            ORDER BY total_vendido DESC;
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro em vendas por categoria:', erro);
        res.status(500).json({ erro: 'Erro ao buscar vendas por categoria' });
    }
};


// 5. Produtos com estoque baixo
exports.estoqueBaixo = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT 
                p.id_produto,
                p.nome AS produto,
                c.nome AS categoria,
                p.estoque_atual,
                p.estoque_minimo
            FROM produto p
            INNER JOIN categoria c 
                ON p.id_categoria = c.id_categoria
            WHERE p.estoque_atual <= p.estoque_minimo
            ORDER BY p.estoque_atual ASC;
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro em estoque baixo:', erro);
        res.status(500).json({ erro: 'Erro ao buscar produtos com estoque baixo' });
    }
};


// 6. Clientes que mais compraram
exports.clientesMaisCompraram = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT 
                c.nome AS cliente,
                COUNT(v.id_venda) AS quantidade_compras,
                SUM(v.valor_total) AS total_gasto
            FROM cliente c
            INNER JOIN venda v 
                ON c.id_cliente = v.id_cliente
            WHERE v.status = 'Finalizada'
            GROUP BY c.nome
            ORDER BY total_gasto DESC
            LIMIT 10;
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro em clientes mais compraram:', erro);
        res.status(500).json({ erro: 'Erro ao buscar clientes que mais compraram' });
    }
};


// 7. Desempenho dos funcionários
exports.desempenhoFuncionarios = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT 
                f.nome AS funcionario,
                f.cargo,
                COUNT(v.id_venda) AS quantidade_vendas,
                COALESCE(SUM(v.valor_total), 0) AS total_vendido
            FROM funcionario f
            LEFT JOIN venda v 
                ON f.id_funcionario = v.id_funcionario
                AND v.status = 'Finalizada'
            GROUP BY f.nome, f.cargo
            ORDER BY total_vendido DESC;
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro em desempenho dos funcionários:', erro);
        res.status(500).json({ erro: 'Erro ao buscar desempenho dos funcionários' });
    }
};


// 8. Vendas por forma de pagamento
exports.vendasPorFormaPagamento = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT 
                forma_pagamento,
                COUNT(*) AS quantidade_vendas,
                SUM(valor_total) AS total_vendido
            FROM venda
            WHERE status = 'Finalizada'
            GROUP BY forma_pagamento
            ORDER BY total_vendido DESC;
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro em vendas por forma de pagamento:', erro);
        res.status(500).json({ erro: 'Erro ao buscar vendas por forma de pagamento' });
    }
};


// 9. Vendas por loja
exports.vendasPorLoja = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT 
                l.nome AS loja,
                l.cidade,
                COUNT(v.id_venda) AS quantidade_vendas,
                COALESCE(SUM(v.valor_total), 0) AS total_vendido
            FROM loja l
            LEFT JOIN venda v 
                ON l.id_loja = v.id_loja
                AND v.status = 'Finalizada'
            GROUP BY l.nome, l.cidade
            ORDER BY total_vendido DESC;
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro em vendas por loja:', erro);
        res.status(500).json({ erro: 'Erro ao buscar vendas por loja' });
    }
};


// 10. Últimas vendas
exports.ultimasVendas = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT 
                v.id_venda,
                v.data_venda,
                c.nome AS cliente,
                f.nome AS funcionario,
                l.nome AS loja,
                v.forma_pagamento,
                v.status,
                v.valor_total
            FROM venda v
            INNER JOIN cliente c 
                ON v.id_cliente = c.id_cliente
            INNER JOIN funcionario f 
                ON v.id_funcionario = f.id_funcionario
            INNER JOIN loja l 
                ON v.id_loja = l.id_loja
            ORDER BY v.data_venda DESC, v.id_venda DESC
            LIMIT 10;
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro em últimas vendas:', erro);
        res.status(500).json({ erro: 'Erro ao buscar últimas vendas' });
    }
};