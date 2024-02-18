import cogoToast, {CToast} from 'cogo-toast'

const toastAlert = (method: keyof CToast, message: string) => {
  cogoToast[method](message)
}
export default toastAlert
