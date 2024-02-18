import {ColDef} from 'ag-grid-community'
import {useState, useEffect} from 'react'

interface Props {
  initData: []
  mode?:string
}

/**
 * useCSVFormatter
 * @param initData - initial data
 * @returns {checkData, handleCheckData}
 */
const useCSVFormatter = ({initData, mode}: Props) => {
  // States
  const [csvData, setCsvData] = useState<[]>([])

  useEffect(() => {
    setCsvData(initData)
  }, [initData])
  //   Actions
  const handleCsvData = (value: any) => {
    // console.log(value)
    setCsvData(value)
    // setCsvData((prevState) =>
    //   prevState.map((i) => (i.field === value ? {...i, hide: !i.hide} : i))
    // )
  }
  return {
    csvData,
    handleCsvData,
  }
}

export default useCSVFormatter
