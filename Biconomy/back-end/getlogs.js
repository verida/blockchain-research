const Web3 = require('web3');
const ControllerContract = require('./contracts/Sum.sol/Sum.json');

// Contract address deployed addresson BSC testnet
// const address = "0xE6132e23d997cf8D69965eefe29e12422CbeC4Da";
const address = "0xa92d4EDeB0AB304ee4c56Ef3f291eba6FF448367";

const web3 = new Web3('https://speedy-nodes-nyc.moralis.io/bd1c39d7c8ee1229b16b4a97/bsc/testnet');

const { privateKey } = require('./.evn.json');

const { address: admin } = web3.eth.accounts.wallet.add(privateKey);
const controller = new web3.eth.Contract(
    ControllerContract.abi,
    address
);

async function calculateSum(a, b) {
    try {
        const tx = controller.methods.calculateSum(a, b);

        
        const [gasPrice, gasCost] = await Promise.all([
            web3.eth.getGasPrice(),
            tx.estimateGas({from: admin}),
        ]);

        const data = tx.encodeABI();

        const txData = {
            from: admin,
            to: controller.options.address,
            data,
            gas: gasCost,
            gasPrice
        };
    // web3.eth.sendTransaction(txData)
    //     .on('transactionHash', (hash) => {
    //         console.log('Hash returned:', hash);
    //     })
    //     .on('receipt', (receipt) => {
    //         console.log('Receipt', receipt);
    //     })
    //     .on('confirmation', (confirmationNumber, receipt) => {
    //         console.log('confirmation', confirmationNumber, ' : ', receipt)
    //     })
    //     .on('error', () => {
    //         console.log('Error')
    //     })
    
        const receipt = await web3.eth.sendTransaction(txData);
        console.log(`Transaction hash: ${receipt.transactionHash}`);
        // console.log('Receipt', receipt);
        return {success:true, transactionHash:receipt.transactionHash};
    } catch (e) {
        // console.log('Error occured : ', e);

        let errMsg = e.data.substr(138);
        errMsg = errMsg.substr(0, errMsg.length - 14)
        // console.log('Err Message = ', errMsg.substr(0, errMsg.length - 14))
        const reason = web3.utils.hexToAscii('0x' + errMsg);
        return {success:false, error:reason}
    }
}

async function getSum() {
    const result = await controller.methods.getSum().call();
    console.log("getSum() = ", result);
    return result;
}

async function testCaller() {
    console.log('Start calling - 1');
    await calculateSum(6,6);
    console.log('End calling - 2');
}

// testCaller();

module.exports = {
    calculateSum,
    getSum
};
  