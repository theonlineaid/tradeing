import axios from 'axios'
import {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {AnyAction} from 'redux'
import {HandleUpdateInterface} from '../common/types/common'

interface Props {
  url: string
  handleUpdate?: ({data, isLoading, isError}: HandleUpdateInterface) => AnyAction
  isUseRedux?: boolean
  responseName?: string
}

const useFetchData = ({url, handleUpdate, isUseRedux = false, responseName = 'data'}: Props) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [data, setData] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const dispatch = useDispatch()

  const _isUseRedux = isUseRedux && handleUpdate

  const urlObj = new URL(url)

  const handleFetchData = async () => {
    _isUseRedux && dispatch(handleUpdate({data: [], isLoading: true, isError: false}))
    const result = await axios.get(url)

    setIsLoading(false)
    _isUseRedux && dispatch(handleUpdate({data: [], isLoading: false, isError: false}))

    if (result?.data) {
      setIsError(false)
      setData(result.data?.[responseName])
      _isUseRedux &&
        dispatch(handleUpdate({data: result.data?.data, isLoading: false, isError: false}))
    } else {
      setIsError(true)
      setErrorMsg('')
      _isUseRedux && dispatch(handleUpdate({data: [], isLoading: false, isError: true}))
    }
  }

  useEffect(() => {
    if (urlObj.pathname.includes('undefined')) return
    handleFetchData()
  }, [url])

  return {
    isError,
    isLoading,
    data,
    errorMsg,
  }
}

export default useFetchData
