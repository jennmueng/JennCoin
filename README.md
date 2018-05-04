# JennCoin was created to practice creating a blockchain

### JennCoin runs on Nodejs and supports multiple nodes

## Installation
Install JennCoin on Nodejs machines with
```
git clone https://github.com/jennmueng/JennCoin
```

```
cd jenncoin
yarn
```



## Usage

Initialize the instance with

```
yarn start
```

Get the local chain by sending a GET request to

```
http://localhost:3000/bc/getChain
```

Add a transaction by sending a POST request with the following data:
```
{
    sender: 'Max',
    recipient: 'Jenn',
    amount: '12345678'
}
```
to
```
http://localhost:3000/bc/transactions/new
```

Mine the blockchain with a get request to
```
http://localhost:3000/bc/mine
```

Commands to interacting with other nodes coming soon.