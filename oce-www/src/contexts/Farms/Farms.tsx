import React, { useCallback, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'

import { oce as oceAddress } from '../../constants/tokenAddresses'
import useOce from '../../hooks/useOce'

import { bnToDec } from '../../utils'
import { getPoolContracts, getEarned } from '../../oceUtils'

import Context from './context'
import { Farm } from './types'

const NAME_FOR_POOL: { [key: string]: string } = {
  yfi_pool:  'YFI Farm',
  // eth_pool:  'Weth Homestead',
  // ampl_pool: 'Ample Soils',
  ycrv_pool: 'Eternal Lands',
  // comp_pool: 'Compounding Hills',
  // link_pool: 'Marine Gardens',
  // lend_pool: 'Aave Agriculture',
  // snx_pool:  'Spartan Grounds',
  // mkr_pool:  'Maker Range',
}

// 符号
const ICON_FOR_POOL: { [key: string]: string } = {
  yfi_pool  : '🐋',
  // eth_pool  : '🌎',
  // ampl_pool : '🌷',
  // comp_pool : '💸',
  // link_pool : '🔗',
  // lend_pool : '🏕️',
  // snx_pool  : '⚔️',
  // mkr_pool  : '🐮',
  ycrv_pool : '🌈',
}

// 个矿池排序
const SORT_FOR_POOL: { [key: string]: number } = {
  yfi_pool:  8,
  // eth_pool:  1,
  // ampl_pool: 2,
  // comp_pool: 3,
  ycrv_pool: 4,
  // link_pool: 5,
  // lend_pool: 6,
  // snx_pool:  7,
  // mkr_pool:  0,
}


const Farms: React.FC = ({ children }) => {

  const [farms, setFarms] = useState<Farm[]>([])
  const [unharvested, setUnharvested] = useState(0)
  
  const oce         = useOce()
  const { account } = useWallet()

  const fetchPools = useCallback(async () => {
    const pools: { [key: string]: Contract} = await getPoolContracts(oce)
    const farmsArr: Farm[] = []
    const poolKeys = Object.keys(pools)

    console.info(pools);

    for (let i = 0; i < poolKeys.length; i++) {
      const poolKey = poolKeys[i]
      const pool    = pools[poolKey]

      let tokenKey = poolKey.replace('_pool', '')

      if (tokenKey === 'eth') {
        tokenKey = 'weth'
      } else if (tokenKey === 'ampl') {
        tokenKey = 'ampl_eth_uni_lp'
      } else if (tokenKey === 'ycrv') {
        tokenKey = 'oce_ycrv_uni_lp'
      }

      const method = pool.methods[tokenKey]
      try {
          let tokenAddress = ''
          if (method) {
              tokenAddress = await method().call()
          } else if (tokenKey === 'oce_ycrv_uni_lp') {
              tokenAddress = '0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8'
          }

        farmsArr.push({
          contract            : pool,
          name                : NAME_FOR_POOL[poolKey],
          depositToken        : tokenKey,
          depositTokenAddress : tokenAddress,
          earnToken           : 'oce',
          earnTokenAddress    : oceAddress,
          icon                : ICON_FOR_POOL[poolKey],
          id                  : tokenKey,
          sort                : SORT_FOR_POOL[poolKey]
        })

      } catch (e) {
        console.log(e)
      }
    }

    farmsArr.sort((a, b) => a.sort < b.sort ? 1 : -1)
    setFarms(farmsArr)
  }, [oce, setFarms])

  useEffect(() => {
    if (oce) {
      fetchPools()
    }
  }, [oce, fetchPools])

  useEffect(() => {
    async function fetchUnharvested () {
      const unharvestedBalances = await Promise.all(farms.map(async (farm: Farm) => {

        console.info(farm.contract)

        const earnings = await getEarned(oce, farm.contract, account)
        return bnToDec(earnings)
      }))
      const totalBal = unharvestedBalances.reduce((acc, val) => acc + val)
      setUnharvested(totalBal)
    }

    if (account && farms.length && oce) {
      fetchUnharvested()
    }

  }, [account, farms, setUnharvested, oce])
  
  return (
    <Context.Provider value={{
      farms,
      unharvested,
    }}>
      {children}
    </Context.Provider>
  )
}

export default Farms