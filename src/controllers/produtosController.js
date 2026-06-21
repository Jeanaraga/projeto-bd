const pool = require('../db');

// Listar todos os produtos
exports.listarProdutos = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT 
                p.id_produto,
                p.nome,
                p.preco_venda,
                p.estoque_atual,
                p.estoque_minimo,
                p.status,
                c.nome AS categoria
            FROM produto p
            INNER JOIN categoria c 
                ON p.id_categoria = c.id_categoria
            ORDER BY p.id_produto;
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro ao listar produtos:', erro);
        res.status(500).json({ erro: 'Erro ao listar produtos' });
    }
};


// Buscar produto por ID
exports.buscarProdutoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await pool.query(`
            SELECT 
                p.id_produto,
                p.nome,
                p.preco_venda,
                p.estoque_atual,
                p.estoque_minimo,
                p.status,
                p.id_categoria,
                c.nome AS categoria
            FROM produto p
            INNER JOIN categoria c 
                ON p.id_categoria = c.id_categoria
            WHERE p.id_produto = $1;
        `, [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }

        res.json(resultado.rows[0]);
    } catch (erro) {
        console.error('Erro ao buscar produto:', erro);
        res.status(500).json({ erro: 'Erro ao buscar produto' });
    }
};


// Cadastrar produto
exports.criarProduto = async (req, res) => {
    try {
        const {
            nome,
            preco_venda,
            estoque_atual,
            estoque_minimo,
            status,
            id_categoria
        } = req.body;

        const resultado = await pool.query(`
            INSERT INTO produto 
                (nome, preco_venda, estoque_atual, estoque_minimo, status, id_categoria)
            VALUES 
                ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `, [
            nome,
            preco_venda,
            estoque_atual,
            estoque_minimo,
            status || 'Ativo',
            id_categoria
        ]);

        res.status(201).json({
            mensagem: 'Produto cadastrado com sucesso',
            produto: resultado.rows[0]
        });
    } catch (erro) {
        console.error('Erro ao cadastrar produto:', erro);
        res.status(500).json({ erro: 'Erro ao cadastrar produto' });
    }
};


// Atualizar produto
exports.atualizarProduto = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            nome,
            preco_venda,
            estoque_atual,
            estoque_minimo,
            status,
            id_categoria
        } = req.body;

        const resultado = await pool.query(`
            UPDATE produto
            SET 
                nome = $1,
                preco_venda = $2,
                estoque_atual = $3,
                estoque_minimo = $4,
                status = $5,
                id_categoria = $6
            WHERE id_produto = $7
            RETURNING *;
        `, [
            nome,
            preco_venda,
            estoque_atual,
            estoque_minimo,
            status,
            id_categoria,
            id
        ]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }

        res.json({
            mensagem: 'Produto atualizado com sucesso',
            produto: resultado.rows[0]
        });
    } catch (erro) {
        console.error('Erro ao atualizar produto:', erro);
        res.status(500).json({ erro: 'Erro ao atualizar produto' });
    }
};


// Inativar produto
exports.inativarProduto = async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await pool.query(`
            UPDATE produto
            SET status = 'Inativo'
            WHERE id_produto = $1
            RETURNING *;
        `, [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }

        res.json({
            mensagem: 'Produto inativado com sucesso',
            produto: resultado.rows[0]
        });
    } catch (erro) {
        console.error('Erro ao inativar produto:', erro);
        res.status(500).json({ erro: 'Erro ao inativar produto' });
    }
};


// Listar categorias para usar em selects
exports.listarCategorias = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT id_categoria, nome
            FROM categoria
            ORDER BY nome;
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro ao listar categorias:', erro);
        res.status(500).json({ erro: 'Erro ao listar categorias' });
    }
};