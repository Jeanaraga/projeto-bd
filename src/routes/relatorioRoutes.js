const express = require('express');
const router = express.Router();

const relatoriosController = require('../controllers/relatorioController.js');

router.get('/inner-join', relatoriosController.innerJoin);

router.get('/left-join', relatoriosController.leftJoin);

router.get('/right-join', relatoriosController.rightJoin);

router.get('/full-join', relatoriosController.fullJoin);

router.get('/group-by-having', relatoriosController.groupByHaving);

router.get('/union', relatoriosController.union);

router.get('/intersect', relatoriosController.intersect);

router.get('/except', relatoriosController.except);

router.get('/estoque', relatoriosController.relatorioEstoque);

module.exports = router;