/**
 * Project   : Benemoy Securities Web Application
 * Details   : Nominees Data - BO Account
 * Author    : BdTask Limited <https://www.bdtask.com>
 * Developers: MMR Ahmad <https://github.com/mmrahmad>
 *           : Ifrat <>
 * Date      : 04-12-2022
 */

import * as Yup from 'yup'

const latinChar = /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

// prettier-ignore
const nomineeSchema = Yup.object().shape({
    nid                    : Yup.number()
                                .typeError('NID should be a number')
                                .required('NID is required.')
                                .test(
                                  'length',
                                  'NID should be 10 or 17 character',
                                  (val) => String(val)?.length === 10 || String(val)?.length === 17
                                ),
    name                   : Yup.string().required("Name is required!").matches(latinChar, "Only contain Latin letters."),
    father_name            : Yup.string().required("Father name is required!").matches(latinChar, "Only contain Latin letters."),
    mother_name            : Yup.string().required("Mother name is required!").matches(latinChar, "Only contain Latin letters."),
    dob                    : Yup.string().required("Date of birth is required!"),
    sex                    : Yup.string().required("Sex is required!"),
    percentage             : Yup.number().required("Percentage is required!").min(1).max(100),
    relation_with_applicant: Yup.string().required("Relation is required!"),
    address1               : Yup.string().required("Address is required").matches(latinChar, "Only contain Latin letters."),
    address2               : Yup.string().matches(latinChar, "Only contain Latin letters."),
    address3               : Yup.string().matches(latinChar, "Only contain Latin letters."),
    country                : Yup.string().required("Country is required"),
    city                   : Yup.string().required("City is required"),
    state                  : Yup.string().required("State is required"),
    phone                  : Yup.number().typeError("Phone number must be number").required("Phone is required"),
    postcode               : Yup.string().required("Post code is required!"),
})

export const nomineeValidationSchema = Yup.object().shape({
  nominees: Yup.array().of(nomineeSchema),
})

// prettier-ignore
export interface NomineeDataInterface {
  bo_account             : number | null
  nid                    : string
  name                   : string
  father_name            : string
  mother_name            : string
  dob                    : string
  sex                    : string
  percentage             : string
  relation_with_applicant: string
  address1               : string
  address2               : string
  address3               : string
  country                : string
  city                   : string
  state                  : string
  phone                  : string
  postcode               : string
}

// prettier-ignore
export const NOMINEE_INIT_VALUE: NomineeDataInterface = {
  bo_account             : null,
  nid                    : '',
  name                   : '',
  father_name            : '',
  mother_name            : '',
  dob                    : '',
  sex                    : '',
  percentage             : '',
  relation_with_applicant: '',
  address1               : '',
  address2               : '',
  address3               : '',
  country                : 'Bangladesh',
  city                   : '',
  state                  : '',
  phone                  : '',
  postcode               : '',
}
