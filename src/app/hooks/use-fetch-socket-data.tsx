import axios from 'axios'
import {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {AnyAction} from 'redux'
import {HandleUpdateInterface} from '../common/types/common'

interface Props {
  url: string
  handleUpdate: ({data, isLoading, isError}: HandleUpdateInterface) => AnyAction
  isUseRedux?: boolean
}

const useFetchSocketData = ({url, handleUpdate, isUseRedux = false}: Props) => {
  // Hooks
  const dispatch = useDispatch()

  // States
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [data, setData] = useState<null | any>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const fetchData = async () => {
    try {
      const sockets = new WebSocket(url + '/')

      // Socket
      sockets.addEventListener('open', (event) => console.log('socket open: ', event))

      // Listen for messages
      sockets.addEventListener('message', (event) => {
        let data = JSON.parse(event.data)
        if (data?.data) {
          setIsLoading(false)
          setIsError(false)
          setData(data.data)

          dispatch(
            handleUpdate({
              data: data?.data,
              isError: false,
              isLoading: false,
            })
          )
        }
      })

      sockets.addEventListener('error', (event) => {
        const ERROR_MSG = 'There are an error to connecting server!'
        setIsLoading(false)
        setIsError(true)
        setErrorMsg(ERROR_MSG)
        setData([])

        dispatch(
          handleUpdate({
            data: [],
            isError: true,
            errorMsg: ERROR_MSG,
            isLoading: false,
          })
        )
      })
    } catch (error) {
      console.error({error})
    }
  }

  fetchData()

  // const handleFetchData = async () => {
  //   isUseRedux && dispatch(handleUpdate({data: [], isLoading: true, isError: false}))
  //   const result = await axios.get(url)

  //   setIsLoading(false)
  //   isUseRedux && dispatch(handleUpdate({data: [], isLoading: false, isError: false}))

  //   if (result?.data) {
  //     setIsError(false)
  //     setData(result.data?.data)
  //     isUseRedux &&
  //       dispatch(handleUpdate({data: result.data?.data, isLoading: false, isError: false}))
  //   } else {
  //     setIsError(true)
  //     setErrorMsg('')
  //     isUseRedux && dispatch(handleUpdate({data: [], isLoading: false, isError: true}))
  //   }
  // }

  // useEffect(() => {
  //   handleFetchData()
  // }, [])

  return {
    isError,
    isLoading,
    data,
    errorMsg,
  }
}

export default useFetchSocketData
