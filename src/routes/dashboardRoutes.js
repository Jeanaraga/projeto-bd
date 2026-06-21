const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController.js');

router.get('/resumo', dashboardController.resumoDashboard);

router.get('/vendas-por-mes', dashboardController.vendasPorMes);

router.get('/produtos-mais-vendidos', dashboardController.produtosMaisVendidos);

router.get('/vendas-por-categoria', dashboardController.vendasPorCategoria);

router.get('/estoque-baixo', dashboardController.estoqueBaixo);

router.get('/clientes-mais-compraram', dashboardController.clientesMaisCompraram);

router.get('/desempenho-funcionarios', dashboardController.desempenhoFuncionarios);

router.get('/formas-pagamento', dashboardController.vendasPorFormaPagamento);

router.get('/vendas-por-loja', dashboardController.vendasPorLoja);

router.get('/ultimas-vendas', dashboardController.ultimasVendas);

module.exports = router;