import { DataTokenOptions } from '@hooks/usePublish'
import { ReactElement } from 'react'

export interface FormPublishService {
  files: string[]
  timeout: string
  dataTokenOptions: DataTokenOptions
  access: 'Download' | 'Compute' | string
  providerUrl?: string
  algorithmPrivacy?: boolean
}

export interface FormPublishData {
  stepCurrent: number
  accountId: string
  chainId: number
  metadata: {
    type: 'Dataset' | 'Algorithm' | string
    name: string
    description: string
    author: string
    termsAndConditions: boolean
    tags?: string
    links?: string[]
    dockerImage?: string
    dockerImageCustom?: string
    dockerImageCustomTag?: string
    dockerImageCustomEntrypoint?: string
  }
  services: FormPublishService[]
  pricing: PriceOptions
}

export interface StepContent {
  step: number
  title: string
  component: ReactElement
}
