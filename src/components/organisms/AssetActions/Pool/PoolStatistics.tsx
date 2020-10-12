import React, { ReactElement } from 'react'
import { Balance } from '.'
import styles from './PoolStatistics.module.css'
import Token from './Token'
import Conversion from '../../../atoms/Price/Conversion'

export default function PoolStatistics({
  price,
  dtSymbol,
  totalBalance,
  totalPoolTokens,
  swapFee
}: {
  price: string
  dtSymbol: string
  totalBalance: Balance
  totalPoolTokens: string
  swapFee: string
}): ReactElement {
  const totalLiquidityInOcean =
    totalBalance.ocean + totalBalance.datatoken * Number(price)

  return (
    <div className={styles.tokeninfo}>
      <h3 className={styles.title}>Pool Statistics</h3>

      <div className={styles.tokens}>
        <div>
          <Token symbol="OCEAN" balance={`${totalBalance.ocean}`} />
          <Token symbol={dtSymbol} balance={`${totalBalance.datatoken}`} />
        </div>
        <div>
          <Token symbol="pool shares" balance={totalPoolTokens} noIcon />
          <Token symbol="% swap fee" balance={swapFee} noIcon />
        </div>

        <Conversion
          price={`${totalLiquidityInOcean}`}
          className={styles.totalLiquidity}
        />
      </div>
    </div>
  )
}
