import express from 'express'
import JennCoin from '../jenncoin'

const router = express.Router();

router.use('/getChain', (req, res, next) => JennCoin.getChain(req, res, next))

router.use('/mine', (req, res, next) => JennCoin.mine(req, res, next))

router.use('/transactions/new', (req, res, next) => JennCoin.newTransaction(req, res, next))
/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('hey')
});

export default router