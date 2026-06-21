const express = require('express');
const router = express.Router();

const produtosController = require('../controllers/produtosController.js');

router.get('/', produtosController.listarProdutos);

router.get('/categorias', produtosController.listarCategorias);

router.get('/:id', produtosController.buscarProdutoPorId);

router.post('/', produtosController.criarProduto);

router.put('/:id', produtosController.atualizarProduto);

router.patch('/:id/inativar', produtosController.inativarProduto);

module.exports = router;