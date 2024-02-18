// import { updateTradeListColumnShow } from '#store/slices/tradeListColumnShow'
import {updateTradeListColumnShow} from '../../../../../redux/slices/tradeListColumnShow'
import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import useTableHook from '../../../../../hooks/use-table-hook'
import TABLE_INIT_VALUE from '../../../constants/trad-list-table-init-value'
import TradingSettings from '../../Tab/Tabs'
import { useSelector } from 'react-redux'
import { RootState } from '#store/index'

const TradingListSettings = () => {
  const globalSetting = useSelector((state: RootState) => state.global)
  const dispatch = useDispatch()
  const INIT_VALUES = useMemo(() => {
    return TABLE_INIT_VALUE(globalSetting.mode)
      
    },[globalSetting.mode])
  const {checkData, handleCheckData} = useTableHook({
    initData: INIT_VALUES,
  })
  useEffect(() => {
    dispatch(updateTradeListColumnShow(checkData))
  }, [checkData, dispatch])
  return (
    <>
      <TradingSettings checkData={checkData} handleCheckData={handleCheckData} />
    </>
  )
}

export default TradingListSettings
