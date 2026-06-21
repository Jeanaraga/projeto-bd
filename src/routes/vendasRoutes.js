const express = require('express');
const router = express.Router();

const vendasController = require('../controllers/vendasController.js');

router.get('/', vendasController.listarVendas);

router.get('/dados-formulario', vendasController.dadosFormularioVenda);

router.get('/:id', vendasController.buscarVendaPorId);

router.post('/', vendasController.criarVenda);

router.patch('/:id/cancelar', vendasController.cancelarVenda);

module.exports = router;