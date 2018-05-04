/* An Express Middleware that connects to and manages the JennCoin blockchain.*/

import Blockchain from './blockchain'
import { validationResult } from 'express-validator/check'

class JennCoin {
    constructor() {
        this.blockchain = new Blockchain()
    }

    getChain = (req, res, next) => {
        res.send({
            message: 'Get Chain',
            chain: this.blockchain.chain
        })

        return next()
    }

    mine = (req, res, next) => {
        const lastBlock = this.blockchain.lastBlock()
        const lastProof = lastBlock.proof
        
        const proof = this.blockchain.proofOfWork(lastProof)

        // Create a new transaction with from 0 (this node) to our node (NODE_NAME) of 1 Chiccocoin
        this.blockchain.newTransaction('0', process.env.NODE_NAME, 1)

        // Forge the new Block by adding it to the chain
        const previousHash = this.blockchain.hash(lastProof)
        const newBlock = this.blockchain.newBlock(proof, previousHash)
        const responseValue = Object.assign({
                message: 'New Block mined'
            }, newBlock)
        res.send(responseValue)
        return next()
    }

    newTransaction = (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.mapped() })
        }

        const trans = req.body
        const index = this.blockchain.newTransaction(trans['sender'], trans['recipient'], trans['amount'])
        const responseValue = {
            message: `Transaction will be added to Block ${index}`
        }
        res.send(responseValue)

        return next()
    }

    registerNode = (req, res, next) => {
        const node = req.body.node

        this.blockchain.registerNode(node)

        return next()
    }

    resolveConflicts = (req, res, next) => {
        this.blockchain.resolveConflicts()

        return next()
    }
}

//Export as an instance
export default new JennCoin()