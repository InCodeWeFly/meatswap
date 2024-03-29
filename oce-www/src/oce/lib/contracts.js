import BigNumber from 'bignumber.js/bignumber';
import Web3 from 'web3';
import * as Types from "./types.js";
import { SUBTRACT_GAS_LIMIT, addressMap } from './constants.js';

import ERC20Json from '../clean_build/contracts/IERC20.json';
import OCEv2Json from '../clean_build/contracts/OCEv2.json';
import OCEv2MigrationJson from '../clean_build/contracts/OCEv2Migration.json';
import OCEJson from '../clean_build/contracts/OCEDelegator.json';
import OCERebaserJson from '../clean_build/contracts/OCERebaser.json';
import OCEReservesJson from '../clean_build/contracts/OCEReserves.json';
import OCEGovJson from '../clean_build/contracts/GovernorAlpha.json';
import OCETimelockJson from '../clean_build/contracts/Timelock.json';
import WETHJson from './weth.json';
import SNXJson from './snx.json';
import UNIFactJson from './unifact2.json';
import UNIPairJson from './uni2.json';
import UNIRouterJson from './uniR.json';

import WETHPoolJson from '../clean_build/contracts/OCEETHPool.json';
import AMPLPoolJson from '../clean_build/contracts/OCEAMPLPool.json';
import YFIPoolJson from '../clean_build/contracts/OCEYFIPool.json';

import MKRPoolJson from '../clean_build/contracts/OCEMKRPool.json';
import LENDPoolJson from '../clean_build/contracts/OCELENDPool.json';
import COMPPoolJson from '../clean_build/contracts/OCECOMPPool.json';
import SNXPoolJson from '../clean_build/contracts/OCESNXPool.json';
import LINKPoolJson from '../clean_build/contracts/OCELINKPool.json';

import IncJson from '../clean_build/contracts/OCEIncentivizer.json';

export class Contracts {
  constructor(
    provider,
    networkId,
    web3,
    options
  ) {
    this.web3 = web3;
    this.defaultConfirmations = options.defaultConfirmations;
    this.autoGasMultiplier = options.autoGasMultiplier || 1.5;
    this.confirmationType = options.confirmationType || Types.ConfirmationType.Confirmed;
    this.defaultGas = options.defaultGas;
    this.defaultGasPrice = options.defaultGasPrice;

    this.uni_pair = new this.web3.eth.Contract(UNIPairJson);
    this.uni_router = new this.web3.eth.Contract(UNIRouterJson);
    this.uni_fact = new this.web3.eth.Contract(UNIFactJson);
    this.yfi = new this.web3.eth.Contract(ERC20Json.abi);
    this.UNIAmpl = new this.web3.eth.Contract(ERC20Json.abi);
    this.ycrv = new this.web3.eth.Contract(ERC20Json.abi);
    this.oce = new this.web3.eth.Contract(OCEJson.abi);

    this.yfi_pool = new this.web3.eth.Contract(YFIPoolJson.abi);
    this.eth_pool = new this.web3.eth.Contract(WETHPoolJson.abi);
    this.ampl_pool = new this.web3.eth.Contract(AMPLPoolJson.abi);
    this.ycrv_pool = new this.web3.eth.Contract(IncJson.abi);

    this.comp_pool = new this.web3.eth.Contract(COMPPoolJson.abi);
    this.link_pool = new this.web3.eth.Contract(LINKPoolJson.abi);
    this.lend_pool = new this.web3.eth.Contract(LENDPoolJson.abi);
    this.snx_pool = new this.web3.eth.Contract(SNXPoolJson.abi);
    this.mkr_pool = new this.web3.eth.Contract(MKRPoolJson.abi);

    this.comp = new this.web3.eth.Contract(ERC20Json.abi);
    this.link = new this.web3.eth.Contract(ERC20Json.abi);
    this.lend = new this.web3.eth.Contract(ERC20Json.abi);
    this.snx = new this.web3.eth.Contract(ERC20Json.abi);
    this.mkr = new this.web3.eth.Contract(ERC20Json.abi);
    this.oce_ycrv_uni_lp = new this.web3.eth.Contract(ERC20Json.abi);

    this.erc20 = new this.web3.eth.Contract(ERC20Json.abi);
    this.pool = new this.web3.eth.Contract(LENDPoolJson.abi);


    this.oceV2 = new this.web3.eth.Contract(OCEv2Json.abi);
    this.oceV2migration = new this.web3.eth.Contract(OCEv2MigrationJson.abi);

    this.rebaser = new this.web3.eth.Contract(OCERebaserJson.abi);
    this.reserves = new this.web3.eth.Contract(OCEReservesJson.abi);
    this.gov = new this.web3.eth.Contract(OCEGovJson.abi);
    this.timelock = new this.web3.eth.Contract(OCETimelockJson.abi);
    this.weth = new this.web3.eth.Contract(WETHJson);
    this.setProvider(provider, networkId);
    this.setDefaultAccount(this.web3.eth.defaultAccount);
  }


  setProvider(
    provider,
    networkId
  ) {
    this.oce.setProvider(provider);
    this.rebaser.setProvider(provider);
    this.reserves.setProvider(provider);
    this.gov.setProvider(provider);
    this.timelock.setProvider(provider);
    const contracts = [
      { contract: this.oce, json: OCEJson },
      { contract: this.rebaser, json: OCERebaserJson },
      { contract: this.reserves, json: OCEReservesJson },
      { contract: this.gov, json: OCEGovJson },
      { contract: this.timelock, json: OCETimelockJson },
      { contract: this.ycrv_pool, json: IncJson },
      { contract: this.eth_pool, json: WETHPoolJson },
      { contract: this.yfi_pool, json: YFIPoolJson },
      { contract: this.ampl_pool, json: AMPLPoolJson },
      { contract: this.snx_pool, json: SNXPoolJson },
      { contract: this.mkr_pool, json: MKRPoolJson },
      { contract: this.lend_pool, json: LENDPoolJson },
      { contract: this.link_pool, json: LINKPoolJson },
      { contract: this.comp_pool, json: COMPPoolJson },
      { contract: this.oceV2, json: OCEv2Json },
      { contract: this.oceV2migration, json: OCEv2MigrationJson },
    ]

    contracts.forEach(contract => this.setContractProvider(
        contract.contract,
        contract.json,
        provider,
        networkId,
      ),
    );
    this.yfi.options.address = addressMap["YFI"];
    this.ycrv.options.address = addressMap["YCRV"];
    this.weth.options.address = addressMap["WETH"];
    this.snx.options.address = addressMap["SNX"];
    this.comp.options.address = addressMap["COMP"];
    this.link.options.address = addressMap["LINK"];
    this.lend.options.address = addressMap["LEND"];
    this.mkr.options.address = addressMap["MKR"];
    this.UNIAmpl.options.address = addressMap["UNIAmpl"];
    this.uni_fact.options.address = addressMap["uniswapFactoryV2"];
    this.uni_router.options.address = addressMap["UNIRouter"];
    this.oce_ycrv_uni_lp.options.address = addressMap["OCEYCRV"];

    this.pools = [
      {"tokenAddr": this.yfi.options.address, "poolAddr": this.yfi_pool.options.address},
      {"tokenAddr": this.snx.options.address, "poolAddr": this.snx_pool.options.address},
      {"tokenAddr": this.weth.options.address, "poolAddr": this.eth_pool.options.address},
      {"tokenAddr": this.comp.options.address, "poolAddr": this.comp_pool.options.address},
      {"tokenAddr": this.link.options.address, "poolAddr": this.link_pool.options.address},
      {"tokenAddr": this.lend.options.address, "poolAddr": this.lend_pool.options.address},
      {"tokenAddr": this.mkr.options.address, "poolAddr": this.mkr_pool.options.address},
      {"tokenAddr": this.UNIAmpl.options.address, "poolAddr": this.ampl_pool.options.address},
    ]
  }

  setDefaultAccount(
    account
  ) {
    this.yfi.options.from  = account;
    this.ycrv.options.from = account;
    this.oce.options.from  = account;
    this.weth.options.from = account;
  }

  async callContractFunction(
    method,
    options
  ) {
    const { confirmations, confirmationType, autoGasMultiplier, ...txOptions } = options;

    if (!this.blockGasLimit) {
      await this.setGasLimit();
    }

    if (!txOptions.gasPrice && this.defaultGasPrice) {
      txOptions.gasPrice = this.defaultGasPrice;
    }

    if (confirmationType === Types.ConfirmationType.Simulate || !options.gas) {
      let gasEstimate;
      if (this.defaultGas && confirmationType !== Types.ConfirmationType.Simulate) {
        txOptions.gas = this.defaultGas;
      } else {
        try {
          console.log("estimating gas");
          gasEstimate = await method.estimateGas(txOptions);
        } catch (error) {
          const data = method.encodeABI();
          const { from, value } = options;
          const to = method._parent._address;
          error.transactionData = { from, value, data, to };
          throw error;
        }

        const multiplier = autoGasMultiplier || this.autoGasMultiplier;
        const totalGas = Math.floor(gasEstimate * multiplier);
        txOptions.gas = totalGas < this.blockGasLimit ? totalGas : this.blockGasLimit;
      }

      if (confirmationType === Types.ConfirmationType.Simulate) {
        let g = txOptions.gas;
        return { gasEstimate, g };
      }
    }

    if (txOptions.value) {
      txOptions.value = new BigNumber(txOptions.value).toFixed(0);
    } else {
      txOptions.value = '0';
    }

    const promi = method.send(txOptions);

    const OUTCOMES = {
      INITIAL: 0,
      RESOLVED: 1,
      REJECTED: 2,
    };

    let hashOutcome = OUTCOMES.INITIAL;
    let confirmationOutcome = OUTCOMES.INITIAL;

    const t = confirmationType !== undefined ? confirmationType : this.confirmationType;

    if (!Object.values(Types.ConfirmationType).includes(t)) {
      throw new Error(`Invalid confirmation type: ${t}`);
    }

    let hashPromise;
    let confirmationPromise;

    if (t === Types.ConfirmationType.Hash || t === Types.ConfirmationType.Both) {
      hashPromise = new Promise(
        (resolve, reject) => {
          promi.on('error', (error) => {
            if (hashOutcome === OUTCOMES.INITIAL) {
              hashOutcome = OUTCOMES.REJECTED;
              reject(error);
              const anyPromi = promi ;
              anyPromi.off();
            }
          });

          promi.on('transactionHash', (txHash) => {
            if (hashOutcome === OUTCOMES.INITIAL) {
              hashOutcome = OUTCOMES.RESOLVED;
              resolve(txHash);
              if (t !== Types.ConfirmationType.Both) {
                const anyPromi = promi ;
                anyPromi.off();
              }
            }
          });
        },
      );
    }

    if (t === Types.ConfirmationType.Confirmed || t === Types.ConfirmationType.Both) {
      confirmationPromise = new Promise(
        (resolve, reject) => {
          promi.on('error', (error) => {
            if (
              (t === Types.ConfirmationType.Confirmed || hashOutcome === OUTCOMES.RESOLVED)
              && confirmationOutcome === OUTCOMES.INITIAL
            ) {
              confirmationOutcome = OUTCOMES.REJECTED;
              reject(error);
              const anyPromi = promi ;
              anyPromi.off();
            }
          });

          const desiredConf = confirmations || this.defaultConfirmations;
          if (desiredConf) {
            promi.on('confirmation', (confNumber, receipt) => {
              if (confNumber >= desiredConf) {
                if (confirmationOutcome === OUTCOMES.INITIAL) {
                  confirmationOutcome = OUTCOMES.RESOLVED;
                  resolve(receipt);
                  const anyPromi = promi ;
                  anyPromi.off();
                }
              }
            });
          } else {
            promi.on('receipt', (receipt) => {
              confirmationOutcome = OUTCOMES.RESOLVED;
              resolve(receipt);
              const anyPromi = promi ;
              anyPromi.off();
            });
          }
        },
      );
    }

    if (t === Types.ConfirmationType.Hash) {
      const transactionHash = await hashPromise;
      if (this.notifier) {
          this.notifier.hash(transactionHash)
      }
      return { transactionHash };
    }

    if (t === Types.ConfirmationType.Confirmed) {
      return confirmationPromise;
    }

    const transactionHash = await hashPromise;
    if (this.notifier) {
        this.notifier.hash(transactionHash)
    }
    return {
      transactionHash,
      confirmation: confirmationPromise,
    };
  }

  async callConstantContractFunction(
    method,
    options
  ) {
    const m2 = method;
    const { blockNumber, ...txOptions } = options;
    return m2.call(txOptions, blockNumber);
  }

  async setGasLimit() {
    const block = await this.web3.eth.getBlock('latest');
    this.blockGasLimit = block.gasLimit - SUBTRACT_GAS_LIMIT;
  }

  setContractProvider(
    contract,
    contractJson,
    provider,
    networkId,
  ){
    contract.setProvider(provider);
    try {
      contract.options.address = contractJson.networks[networkId]
        && contractJson.networks[networkId].address;
    } catch (error) {
      // console.log(error)
    }
  }
}
