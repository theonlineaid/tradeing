import {ColDef} from 'ag-grid-community'
import {useState, useEffect} from 'react'

interface Props {
  initData: ColDef[]
  mode?:string
}

/**
 * useTableHook
 * @param initData - initial data
 * @returns {checkData, handleCheckData}
 */
const useTableHook = ({initData, mode}: Props) => {
  // States
  const [checkData, setCheckData] = useState<ColDef[]>([])

  useEffect(() => {
    setCheckData(initData)
  }, [initData])
  //   Actions
  const handleCheckData = (event: any, value: string) => {
    setCheckData((prevState) =>
      prevState.map((i) => (i.field === value ? {...i, hide: !i.hide} : i))
    )
  }
  return {
    checkData,
    handleCheckData,
  }
}

export default useTableHook
