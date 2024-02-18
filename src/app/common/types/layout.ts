export type layoutBreakpoints = 'lg' | 'md' | 'sm' | 'xs' | 'xxs'

export type viewNameType =
  | 'trading_GROUP'
  | 'trading_map'
  | 'trading_bar'
  | 'market_map'
  | 'order_GROUP'
  | 'buy_sell'
  | 'performance_INDIVIDUAL'
  | 'position_INDIVIDUAL'
  | 'execution_INDIVIDUAL'
  | 'orderSummery_INDIVIDUAL'
  | 'blotter_INDIVIDUAL'
  | 'news_INDIVIDUAL'
  | 'purchase_power_INDIVIDUAL'

export interface InitLayoutPartInterface {
  x: number
  y: number
  w: number
  h: number
  i: any
  static: boolean
  component_type: string
  isBounded?: undefined | boolean
  isDraggable?: undefined | boolean
  isResizable?: undefined | boolean
  maxH?: boolean | undefined
  maxW?: boolean | undefined
  minH?: boolean | undefined
  minW?: boolean | undefined
  moved: boolean | undefined
  resizeHandles?: (string | number)[]
}

export interface LayoutStateInterface {
  currentBreakpoint: layoutBreakpoints
  compactType: 'vertical' | 'horizontal'
  mounted: boolean
}

export type fullLayoutInterface = {[Key in layoutBreakpoints]: InitLayoutPartInterface[]}
