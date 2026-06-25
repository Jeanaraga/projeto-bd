const pool = require('../db');


// INNER JOIN
exports.innerJoin = async (req, res) => {
    try {
        const resultado = await pool.query(`
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
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro no INNER JOIN:', erro);
        res.status(500).json({ erro: 'Erro no relatório INNER JOIN' });
    }
};


// LEFT JOIN
exports.leftJoin = async (req, res) => {
    try {
        const resultado = await pool.query(`
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
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro no LEFT JOIN:', erro);
        res.status(500).json({ erro: 'Erro no relatório LEFT JOIN' });
    }
};


// RIGHT JOIN
exports.rightJoin = async (req, res) => {
    try {
        const resultado = await pool.query(`
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
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro no RIGHT JOIN:', erro);
        res.status(500).json({ erro: 'Erro no relatório RIGHT JOIN' });
    }
};


// FULL JOIN
exports.fullJoin = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT 
                c.id_cliente,
                c.nome AS cliente,
                v.id_venda,
                v.valor_total
            FROM cliente c
            FULL JOIN venda v 
                ON c.id_cliente = v.id_cliente
            ORDER BY c.id_cliente, v.id_venda;
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro no FULL JOIN:', erro);
        res.status(500).json({ erro: 'Erro no relatório FULL JOIN' });
    }
};


// GROUP BY + HAVING
exports.groupByHaving = async (req, res) => {
    try {
        const resultado = await pool.query(`
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
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro no GROUP BY/HAVING:', erro);
        res.status(500).json({ erro: 'Erro no relatório GROUP BY/HAVING' });
    }
};


// UNION
exports.union = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT nome, 'Cliente' AS tipo
            FROM cliente

            UNION

            SELECT nome, 'Funcionário' AS tipo
            FROM funcionario

            ORDER BY nome;
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro no UNION:', erro);
        res.status(500).json({ erro: 'Erro no relatório UNION' });
    }
};


// INTERSECT
exports.intersect = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT id_cliente
            FROM venda

            INTERSECT

            SELECT id_cliente
            FROM endereco_cliente

            ORDER BY id_cliente;
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro no INTERSECT:', erro);
        res.status(500).json({ erro: 'Erro no relatório INTERSECT' });
    }
};


// EXCEPT
exports.except = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT id_cliente, nome
            FROM cliente

            EXCEPT

            SELECT c.id_cliente, c.nome
            FROM cliente c
            INNER JOIN venda v 
                ON c.id_cliente = v.id_cliente

            ORDER BY id_cliente;
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro no EXCEPT:', erro);
        res.status(500).json({ erro: 'Erro no relatório EXCEPT' });
    }
};


// Relatório geral de estoque
exports.relatorioEstoque = async (req, res) => {
    try {
        const resultado = await pool.query(`
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
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro no relatório de estoque:', erro);
        res.status(500).json({ erro: 'Erro no relatório de estoque' });
    }
};