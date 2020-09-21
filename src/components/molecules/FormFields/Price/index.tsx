import React, { ReactElement, useState, useEffect } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { InputProps } from '../../../atoms/Input'
import styles from './index.module.css'
import Tabs from '../../../atoms/Tabs'
import Fixed from './Fixed'
import Dynamic from './Dynamic'
import { useField } from 'formik'
import { useUserPreferences } from '../../../../providers/UserPreferences'
import { DataTokenOptions, PriceOptions, useOcean } from '@oceanprotocol/react'
import { PriceOptionsMarket } from '../../../../@types/MetaData'

const query = graphql`
  query PriceFieldQuery {
    content: allFile(filter: { relativePath: { eq: "pages/publish.json" } }) {
      edges {
        node {
          childPagesJson {
            price {
              fixed {
                title
                info
              }
              dynamic {
                title
                info
                tooltips {
                  poolInfo
                  liquidityProviderFee
                  communityFee
                  marketplaceFee
                }
              }
            }
          }
        }
      }
    }
  }
`

export default function Price(props: InputProps): ReactElement {
  const { debug } = useUserPreferences()
  const data = useStaticQuery(query)
  const content = data.content.edges[0].node.childPagesJson.price
  const { ocean } = useOcean()

  const [field, meta, helpers] = useField(props.name)
  const { price }: PriceOptionsMarket = field.value

  const [tokensToMint, setTokensToMint] = useState<number>()
  const [datatokenOptions, setDatatokenOptions] = useState<DataTokenOptions>()

  function handleTabChange(tabName: string) {
    const type = tabName.toLowerCase()
    helpers.setValue({ ...field.value, type })
  }

  function generateName() {
    if (!ocean) return
    const newDatatokenOptions = ocean.datatokens.generateDtName()
    setDatatokenOptions(newDatatokenOptions)
  }

  // Always update everything when amountOcean changes
  useEffect(() => {
    const tokensToMint = Number(price) * Number(field.value.weightOnDataToken)
    setTokensToMint(tokensToMint)
    helpers.setValue({ ...field.value, tokensToMint })
  }, [price])

  // Generate new DT name & symbol
  useEffect(() => {
    generateName()
  }, [ocean])

  const tabs = [
    {
      title: content.fixed.title,
      content: (
        <Fixed
          datatokenOptions={datatokenOptions}
          generateName={generateName}
          content={content.fixed}
        />
      )
    },
    {
      title: content.dynamic.title,
      content: (
        <Dynamic
          ocean={price}
          priceOptions={{ ...field.value, tokensToMint }}
          datatokenOptions={datatokenOptions}
          generateName={generateName}
          content={content.dynamic}
        />
      )
    }
  ]

  return (
    <div className={styles.price}>
      <Tabs items={tabs} handleTabChange={handleTabChange} />
      {debug === true && (
        <pre>
          <code>{JSON.stringify(field.value, null, 2)}</code>
        </pre>
      )}
    </div>
  )
}
