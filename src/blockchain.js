import * as bcrypt from 'bcrypt'
import * as publicIp from 'public-ip'
import * as crypto from 'crypto'
import request from 'request'

export default class Blockchain {
    constructor () {
        // Create chain and transaction
        this.chain = []
        this.current_transactions = []
        this.nodes = []

        //Initialize the genesis block
        this.newBlock('100', '1')
    }

    newBlock = (proof, previousHash) => {
         /* Create the new block */ 
        let block = {
            index : this.chain.length,
            timestamp : Date.now(),
            transactions : this.current_transactions,
            proof: proof,
            previousHash: previousHash
        }
        this.current_transactions = []
        this.chain.push(block)
        return block
    }
  
    newTransaction = (sender, recipient, amount) => { 
        let transaction = {
            sender : sender,
            recipient: recipient,
            amount: amount
        }
        this.current_transactions.push(transaction)
        return this.lastBlock()['index'] + 1
    }
  
    hash = (block) => { 
        /* hash the block */ 
        const blockString = JSON.stringify(block)
        const hash = crypto.createHmac(process.env.HASH_TYPE, process.env.CRYPTO_SECRET)
        .update(blockString)
        .digest('hex')
        return hash
    }
    
    validProof = (lastProof, proof) => {
        /* Check the proof */
        const guessHash = crypto.createHmac(process.env.HASH_TYPE, process.env.CRYPTO_SECRET)
        .update(`${lastProof}${proof}`)
        .digest('hex')
        return guessHash.substr(0, 5) === process.env.RESOLUTION_HASH
    }

    proofOfWork = (lastProof) => {
        let proof = 0
        while (true) {
            if (!this.validProof(lastProof, proof)) {
                console.log(proof)
                proof++
            } else {
                break
            }
        }
        return proof
    }

    lastBlock = () => { 
        /* return the last block */
            return this.chain.slice(-1)[0]
        
    }

    registerNode = (address) => {
        /* Registers a new neighbor node */
        this.nodes.push(address)
    }

    verifyChain = (chain) => {
        /* Verifies the chain from the neighbor node 
            Returns:
                TRUE if valid
                FALSE if not. */
        
        let lastBlock = chain[0]
        let currentIndex = 1

        while (currentIndex < chain.length) {
            let block = chain[currentIndex]

            if (block.previousHash !== this.chain.hash(lastBlock)) {
                return false
            }
            if (!this.validProof(lastBlock['proof'], block['proof'])) {
                return false
            }
            lastBlock = block
            currentIndex++
        }
        return true

    }

    resolveConflicts = () => {
        /* 
            This method checks our neighbors' chains, if we find a longer and valid chain, switch ours with theirs.
        */
        //Get our neighbors
        let neighbors = this.nodes
        let newChain = []

        //Only looking for chains longer than ours
        let maxLength = this.chain.length

        let numberOfNeighbors = neighbors.length
        let iterations = 0
        while (iterations < neighbors.length) {
            request(`http://${neighbors[iterations]}/bc/getChain`, (err, res, body) => {
                console.log('error:', error); // Print the error if one occurred and handle it
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                if (res.statusCode === 200) {
                    let chain = JSON.parse(body.chain)
                    let chainLength = chain.length
                    
                    if (chainLength > maxLength && this.verifyChain(chain)) {
                        maxLength = chainLength
                        newChain = chain
                    }
                }
            });
        }
        if (newChain) {
            this.chain = newChain
            return true
        } else {
            return false
        }
    }
}

