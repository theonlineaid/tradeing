import {viewNameType} from './layout'

export interface TableColInterface {
  id: number
  value: string
  title: string
  checked: boolean
  width: number
}

export interface LayoutComponentInterface {
  id: viewNameType
  title: null | string
  tabs: {
    id: string
    title: string
  }[]
}

export type dashboardComponentsType = {[Key in viewNameType]: React.ElementType}
