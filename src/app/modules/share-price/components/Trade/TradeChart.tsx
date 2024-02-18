import {useLayoutEffect, useState} from 'react'
import {shareChartGraph} from '../../../auth/core/_requests'
import Chart from '../../Chart'

import {TypeChooser} from 'react-stockcharts/lib/helper'

export function TradeChart() {
  const [data, setData] = useState<any>([])

  useLayoutEffect(() => {
    shareChartGraph().then((d) => {
      setData(d.data)
    })
  }, [])

  return (
    <>
      {data?.length !== 0 && (
        <>
          <TypeChooser>{(type) => <Chart type='hybrid' data={data} ratio={1} />}</TypeChooser>
        </>
      )}
    </>
  )
}
