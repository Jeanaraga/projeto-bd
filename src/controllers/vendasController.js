const pool = require('../db');


// Listar vendas
exports.listarVendas = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT 
                v.id_venda,
                v.data_venda,
                v.valor_total,
                v.forma_pagamento,
                v.status,
                c.nome AS cliente,
                f.nome AS funcionario,
                l.nome AS loja
            FROM venda v
            INNER JOIN cliente c 
                ON v.id_cliente = c.id_cliente
            INNER JOIN funcionario f 
                ON v.id_funcionario = f.id_funcionario
            INNER JOIN loja l 
                ON v.id_loja = l.id_loja
            ORDER BY v.id_venda DESC;
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro ao listar vendas:', erro);
        res.status(500).json({ erro: 'Erro ao listar vendas' });
    }
};


// Buscar detalhes de uma venda
exports.buscarVendaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const venda = await pool.query(`
            SELECT 
                v.id_venda,
                v.data_venda,
                v.valor_total,
                v.forma_pagamento,
                v.status,
                c.nome AS cliente,
                f.nome AS funcionario,
                l.nome AS loja
            FROM venda v
            INNER JOIN cliente c 
                ON v.id_cliente = c.id_cliente
            INNER JOIN funcionario f 
                ON v.id_funcionario = f.id_funcionario
            INNER JOIN loja l 
                ON v.id_loja = l.id_loja
            WHERE v.id_venda = $1;
        `, [id]);

        if (venda.rows.length === 0) {
            return res.status(404).json({ erro: 'Venda não encontrada' });
        }

        const itens = await pool.query(`
            SELECT 
                iv.id_produto,
                p.nome AS produto,
                iv.quantidade,
                iv.preco_unitario,
                iv.desconto,
                iv.subtotal
            FROM item_venda iv
            INNER JOIN produto p 
                ON iv.id_produto = p.id_produto
            WHERE iv.id_venda = $1;
        `, [id]);

        res.json({
            venda: venda.rows[0],
            itens: itens.rows
        });
    } catch (erro) {
        console.error('Erro ao buscar venda:', erro);
        res.status(500).json({ erro: 'Erro ao buscar venda' });
    }
};


// Criar venda com itens
exports.criarVenda = async (req, res) => {
    const client = await pool.connect();

    try {
        const {
            id_cliente,
            id_funcionario,
            id_loja,
            forma_pagamento,
            itens
        } = req.body;

        if (!itens || itens.length === 0) {
            return res.status(400).json({ erro: 'A venda precisa ter pelo menos um item' });
        }

        await client.query('BEGIN');

        let valorTotal = 0;

        const vendaCriada = await client.query(`
            INSERT INTO venda 
                (valor_total, forma_pagamento, status, id_cliente, id_funcionario, id_loja)
            VALUES 
                (0, $1, 'Finalizada', $2, $3, $4)
            RETURNING id_venda;
        `, [
            forma_pagamento,
            id_cliente,
            id_funcionario,
            id_loja
        ]);

        const idVenda = vendaCriada.rows[0].id_venda;

        for (const item of itens) {
            const { id_produto, quantidade, desconto = 0 } = item;

            const produto = await client.query(`
                SELECT id_produto, nome, preco_venda, estoque_atual
                FROM produto
                WHERE id_produto = $1 AND status = 'Ativo';
            `, [id_produto]);

            if (produto.rows.length === 0) {
                throw new Error(`Produto ${id_produto} não encontrado ou inativo`);
            }

            const dadosProduto = produto.rows[0];

            if (dadosProduto.estoque_atual < quantidade) {
                throw new Error(`Estoque insuficiente para o produto: ${dadosProduto.nome}`);
            }

            const precoUnitario = Number(dadosProduto.preco_venda);
            const subtotal = (precoUnitario * quantidade) - Number(desconto);

            if (subtotal < 0) {
                throw new Error(`Desconto inválido para o produto: ${dadosProduto.nome}`);
            }

            valorTotal += subtotal;

            await client.query(`
                INSERT INTO item_venda 
                    (id_venda, id_produto, quantidade, preco_unitario, desconto, subtotal)
                VALUES 
                    ($1, $2, $3, $4, $5, $6);
            `, [
                idVenda,
                id_produto,
                quantidade,
                precoUnitario,
                desconto,
                subtotal
            ]);

            await client.query(`
                UPDATE produto
                SET estoque_atual = estoque_atual - $1
                WHERE id_produto = $2;
            `, [
                quantidade,
                id_produto
            ]);

            await client.query(`
                INSERT INTO movimentacao_estoque
                    (id_produto, tipo_movimentacao, quantidade, motivo)
                VALUES
                    ($1, 'Saida', $2, 'Venda realizada');
            `, [
                id_produto,
                quantidade
            ]);
        }

        await client.query(`
            UPDATE venda
            SET valor_total = $1
            WHERE id_venda = $2;
        `, [
            valorTotal,
            idVenda
        ]);

        await client.query(`
            INSERT INTO parcela_pagamento
                (id_venda, numero_parcela, valor, data_vencimento, status)
            VALUES
                ($1, 1, $2, CURRENT_DATE, 'Paga');
        `, [
            idVenda,
            valorTotal
        ]);

        await client.query('COMMIT');

        res.status(201).json({
            mensagem: 'Venda criada com sucesso',
            id_venda: idVenda,
            valor_total: valorTotal
        });

    } catch (erro) {
        await client.query('ROLLBACK');

        console.error('Erro ao criar venda:', erro);
        res.status(500).json({
            erro: erro.message || 'Erro ao criar venda'
        });
    } finally {
        client.release();
    }
};


// Cancelar venda
exports.cancelarVenda = async (req, res) => {
    const client = await pool.connect();

    try {
        const { id } = req.params;

        await client.query('BEGIN');

        const venda = await client.query(`
            SELECT id_venda, status
            FROM venda
            WHERE id_venda = $1;
        `, [id]);

        if (venda.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ erro: 'Venda não encontrada' });
        }

        if (venda.rows[0].status === 'Cancelada') {
            await client.query('ROLLBACK');
            return res.status(400).json({ erro: 'Venda já está cancelada' });
        }

        const itens = await client.query(`
            SELECT id_produto, quantidade
            FROM item_venda
            WHERE id_venda = $1;
        `, [id]);

        for (const item of itens.rows) {
            await client.query(`
                UPDATE produto
                SET estoque_atual = estoque_atual + $1
                WHERE id_produto = $2;
            `, [
                item.quantidade,
                item.id_produto
            ]);

            await client.query(`
                INSERT INTO movimentacao_estoque
                    (id_produto, tipo_movimentacao, quantidade, motivo)
                VALUES
                    ($1, 'Entrada', $2, 'Cancelamento de venda');
            `, [
                item.id_produto,
                item.quantidade
            ]);
        }

        await client.query(`
            UPDATE venda
            SET status = 'Cancelada'
            WHERE id_venda = $1;
        `, [id]);

        await client.query('COMMIT');

        res.json({ mensagem: 'Venda cancelada com sucesso' });

    } catch (erro) {
        await client.query('ROLLBACK');

        console.error('Erro ao cancelar venda:', erro);
        res.status(500).json({ erro: 'Erro ao cancelar venda' });
    } finally {
        client.release();
    }
};


// Dados auxiliares para tela de vendas
exports.dadosFormularioVenda = async (req, res) => {
    try {
        const clientes = await pool.query(`
            SELECT id_cliente, nome
            FROM cliente
            WHERE status = 'Ativo'
            ORDER BY nome;
        `);

        const funcionarios = await pool.query(`
            SELECT id_funcionario, nome
            FROM funcionario
            WHERE status = 'Ativo'
            ORDER BY nome;
        `);

        const lojas = await pool.query(`
            SELECT id_loja, nome
            FROM loja
            ORDER BY nome;
        `);

        const produtos = await pool.query(`
            SELECT id_produto, nome, preco_venda, estoque_atual
            FROM produto
            WHERE status = 'Ativo'
            ORDER BY nome;
        `);

        res.json({
            clientes: clientes.rows,
            funcionarios: funcionarios.rows,
            lojas: lojas.rows,
            produtos: produtos.rows
        });

    } catch (erro) {
        console.error('Erro ao buscar dados do formulário:', erro);
        res.status(500).json({ erro: 'Erro ao buscar dados do formulário de venda' });
    }
};