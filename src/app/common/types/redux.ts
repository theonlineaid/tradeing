import type {Layout, LayoutItem} from 'react-grid-layout/lib/utils'
import {layoutBreakpoints} from './layout'

export interface MinimizeLayoutInterface {
  [key: string]: {
    [key in layoutBreakpoints]?: LayoutItem
  }
}

interface PageLayoutsInterface {
  name: string
  layout: {
    [key in layoutBreakpoints]: Layout
  }
  minimize: MinimizeLayoutInterface | null
}

export interface ReduxLayoutInterface {
  [pageName: string]: {
    layouts: LayoutInterface
  }
}

export interface LayoutInterface {
  layoutName: string
  pages: PageLayoutsInterface[]
}
