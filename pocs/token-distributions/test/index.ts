/* eslint-disable prettier/prettier */
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { solidity } from "ethereum-waffle";
import hre, { ethers, web3 } from "hardhat";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "@ethersproject/bignumber";
import { MockToken } from "../typechain";

chai.use(solidity);
chai.use(chaiAsPromised);

let accountList: SignerWithAddress[];
const distributeList : string[] = [];

// $G
const distributeCount = 100;

before(async function () {
  await hre.network.provider.send("hardhat_reset");

  await hre.network.provider.request({
      method: "hardhat_reset",
      params: [],
  });

  accountList = await ethers.getSigners();
  // for (let i = 0; i < accountList.length; i++)
  //     console.log(i , "## ", accountList[i].address, " - ",await accountList[i].getBalance());
  // for (let i = 0; i < 100; i++)
  //     console.log(i , "## ", accountList[i].address, " - ",await accountList[i].getBalance());

  for (let i = 0; i < distributeCount; i++)
    distributeList.push(accountList[i].address);

});

describe("Test", function () {
  const withdrawAmount = ethers.utils.parseEther("10");
  const firstDistributeAmount = ethers.utils.parseEther("2");
  const secondDistributeAmount = ethers.utils.parseEther("8");
  const secondDistributeCount = distributeCount; // 100

  let contract : MockToken;

  const stakeEther = async (stakeCount : number, distributeFirstCount: number) => {

    let needEthTotal = withdrawAmount.mul(stakeCount);
    needEthTotal = needEthTotal.add(firstDistributeAmount.mul(distributeFirstCount));
    needEthTotal = needEthTotal.add(secondDistributeAmount.mul(secondDistributeCount));
    // console.log("Total Need : ", needEthTotal);

    let stakeAddressList : string[] = [];

    for (let i = 0; i < stakeCount; i++) {
      stakeAddressList.push(accountList[i].address);
      // await contract.connect(accountList[i]).stake({value: stakeAmount});
      if (i % 50 === 0) {
        await contract.addStakeAddressList(stakeAddressList);
        stakeAddressList = [];
      }
    }

    await contract.addStakeAddressList(stakeAddressList);
    // await contract.setStakeAddressList(stakeAddressList);

    // console.log("Current Contract Bal : ", await ethers.provider.getBalance(contract.address));

    const sendAmountPerAccount = ethers.utils.parseEther("4000");

    const transferCount : number = needEthTotal.div(sendAmountPerAccount).toNumber() + 1;
    // console.log("Send Eth to contract from ", transferCount);
    for (let i = 0; i < transferCount; i++) {
      // console.log(i, " -- ", await ethers.provider.getBalance(accountList[i].address));
      await accountList[i+1].sendTransaction({
        to: contract.address,
        value: sendAmountPerAccount
      });
    }

    // console.log("Current Contract Bal : ", await ethers.provider.getBalance(contract.address));
  }

  const testCommon = async (stakeCount : number, distributeFirstCount : number) => {
    console.log("$A = ", stakeCount);
    console.log("$E = ", distributeFirstCount);

    // $A
    await stakeEther(stakeCount, distributeFirstCount);

    // $E
    await contract.setDistributeFirstCount(distributeFirstCount);

    // Check $A
    expect(await contract.stakeAddressCount()).to.be.eq(stakeCount);
    // Check $A
    expect(await contract.distributeFirstCount()).to.be.eq(distributeFirstCount);

    // Check $A addresses staked correctly
    // expect(await ethers.provider.getBalance(contract.address)).to.be.eq(stakeAmount.mul(stakeCount));

    // Call distribute
    await contract.distribute();
  }

  this.beforeEach(async function () {
    await hre.network.provider.send("hardhat_reset");

    const contractFactory = await ethers.getContractFactory("MockToken");
    contract = await contractFactory.deploy();
    await contract.deployed();

    await contract.setDistributeAddressList(distributeList);
  })

  
  /*
  it("Scenario - 1", async function () {
    // $A
    const stakeCount = 5;
    // $E
    const distributeFirstCount = 20;

    // $A
    await stakeEther(stakeCount);

    // $E
    await contract.setDistributeFirstCount(distributeFirstCount);

    // Check $A
    expect(await contract.stakeAddressCount()).to.be.eq(stakeCount);
    // Check $A
    expect(await contract.distributeFirstCount()).to.be.eq(distributeFirstCount);

    // Check $A addresses staked correctly
    expect(await ethers.provider.getBalance(contract.address)).to.be.eq(stakeAmount.mul(stakeCount));

    // Send more ETH, coz staked amount is not enought to distribute 
    // await contract.connect(accountList[21]).stake({value: ethers.utils.parseEther("800")});   
    await accountList[21].sendTransaction({
      to: contract.address,
      value: ethers.utils.parseEther("800")
    });

    // Call distribute
    await contract.distribute();

    // const methodSignature = web3.eth.abi.encodeFunctionSignature("distribute");

    // const gas = await ethers.provider.estimateGas({
    //   from: accountList[0].address,
    //   to: contract.address,
    //   data: methodSignature,
    //   function (estimatedGas, err) {
    //     console.log("estimatedGas:" + estimatedGas);
    //     console.log("Err:" + err);
    //   }
    // });

    // console.log("Gas : ", gas);
   
    // ethers.provider.estimateGas()
  });
  */

  it ("Scenario - 1", async function () {
    // $A
    const stakeCount = 5;
    // $E
    const distributeFirstCount = 20;

    await testCommon(stakeCount, distributeFirstCount);
  })
  

  it ("Scenario - 2", async function () {
    // $A
    const stakeCount = 1000;
    // $E
    const distributeFirstCount = 20;

    await testCommon(stakeCount, distributeFirstCount);
  })

  it ("Scenario - 3", async function () {
    // $A
    const stakeCount = 10000;
    // $E
    const distributeFirstCount = 20;

    await testCommon(stakeCount, distributeFirstCount);
  })

  it ("Scenario - 4", async function () {
    // $A
    const stakeCount = 100;
    // $E
    const distributeFirstCount = 50;

    await testCommon(stakeCount, distributeFirstCount);
  })

  it ("Scenario - 5", async function () {
    // $A
    const stakeCount = 100;
    // $E
    const distributeFirstCount = 100;

    await testCommon(stakeCount, distributeFirstCount);
  })

  
});
