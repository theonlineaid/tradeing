import * as React from 'react'
import {Responsive, WidthProvider} from 'react-grid-layout'
import type {Layout, ReactChildren} from 'react-grid-layout/lib/utils'
import {LayoutStateInterface} from '../common/types/layout'
const ResponsiveReactGridLayout = WidthProvider(Responsive)

interface Props {
  layouts: any[]
  state: LayoutStateInterface
  onBreakpointChange: (Breakpoint) => void
  onLayoutChange: (currentLayout: Layout) => void
  onDrop: (layout: Layout, item: any, e: Event) => void
  generateDOM: () => ReactChildren
}

const DashboardDefaultLayout: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  layouts,
  state,
  onBreakpointChange,
  onLayoutChange,
  onDrop,
  generateDOM,
}) => {
  const initData = {
    className: 'layout',
    rowHeight: 1,
    autoSize: true,
    cols: {lg: 12, md: 6, sm: 2, xs: 2, xxs: 2},
  }
  return (
    <div>
      <ResponsiveReactGridLayout
        {...initData}
        layouts={layouts}
        resizeHandles={["s", "w", "e", "n", "sw", "nw", "se", "ne"]}
        onBreakpointChange={onBreakpointChange}
        onLayoutChange={onLayoutChange}
        onDrop={onDrop}
        measureBeforeMount={false}
        useCSSTransforms={state.mounted}
        compactType={state.compactType}
        preventCollision={!state.compactType}
      >
        {generateDOM()}
      </ResponsiveReactGridLayout>
    </div>
  )
}

export default DashboardDefaultLayout
