import * as Yup from 'yup'

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

export const addressDetailsSchema = Yup.object({
  permanant_address: Yup.string().required('Permanant Address is required'),
  present_address_line1: Yup.string().required('Address, street is required'),
  present_address_line2: Yup.string().required('Present Address is required'),
  present_address_line3: Yup.string().required('Present Address 2 is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  postcode: Yup.number().required('Post Code is required'),
  phone: Yup.string()
    .matches(phoneRegExp, 'Phone no not valid')
    .required('Phone is required')
    .typeError('Phone must be number'),
  email: Yup.string().email('Invalid email address'),
  contract1: Yup.string()
    .matches(phoneRegExp, 'Contact no not valid')
    .max(11, 'Contact number will be 11 digits!'),
  contract2: Yup.string()
    .matches(phoneRegExp, 'Contact no not valid')
    .max(11, 'Contact number will be 11 digits!'),
  fax: Yup.string().matches(phoneRegExp, 'Fax not valid!'),
})

export interface AddressInitialValuesInterface {
  bo_account: string
  permanant_address: string
  present_address_line1: string
  present_address_line2: string
  present_address_line3: string
  city: string
  state: string
  country: string
  postcode: string
  contract1: string
  contract2: string
  email: string
  phone: string
  fax: string
}

export const addressInitialValues: AddressInitialValuesInterface = {
  bo_account: '',
  permanant_address: '',
  present_address_line1: '',
  present_address_line2: '',
  present_address_line3: '',
  city: '',
  state: '',
  country: 'Bangladesh',
  postcode: '',
  contract1: '',
  contract2: '',
  email: '',
  phone: '',
  fax: '',
}
