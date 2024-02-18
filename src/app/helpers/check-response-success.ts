import {AxiosResponse} from 'axios'

const checkResponseSuccess = (response: AxiosResponse) => {
  return response.data?.status >= 200 && response.data?.status < 300
}
export default checkResponseSuccess
