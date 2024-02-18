/**
 * Project   : Benemoy Securities Web Application
 * Details   : Basic Info DATA - BO Account
 * Author    : BdTask Limited <https://www.bdtask.com>
 * Developers: MMR Ahmad <https://github.com/mmrahmad>
 * Date      : 29-11-2022
 */
import * as Yup from 'yup'

const latinChar = /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi
export interface BasicInfoInterface {
  id: null | number
  bo_account: string
  person_type: string
  nid_no_type: number
  nid: string
  name: string
  father_name: string
  mother_name: string
  dob: string
  sex: string
  citizen: string
  statement_cycle: string
  occupation: string
  tin: string
  passport_no: string
  passport_issue_date: string | null
  passport_expire_date: string | null
  passport_issue_place: string
  manage_bo: boolean
}

// prettier-ignore
export const basicInfoSchema = Yup.object().shape({
  bo_account : Yup.string(),
  person_type: Yup.string(),
  nid_no_type: Yup.number().required(),
  nid        : Yup.number()
    .typeError('NID should be a number')
    .required('NID is required.')
    .test(
      'length',
      'NID should be 10 or 17 character',
      (val) => String(val)?.length === 10 || String(val)?.length === 17
    ),
// matches(/(\d+)/, "Number not allowed!")
  name: Yup.string().matches(
    latinChar,
        'Name can only contain Latin letters.'
    )
    .required('Name is required')
    .min(3, 'Name at lest 3 character')
    .max(50, 'Name should not be more then 50 character'),
  father_name: Yup.string().matches(
    latinChar,
        'Father name can only contain Latin letters.'
    )
    .required('Fathers name is required')
    .min(3, 'Fathers name at lest 3 character')
    .max(50, 'Fathers name should not be more then 50 character'),
  mother_name: Yup.string().matches(
    latinChar,
        'Mother can only contain Latin letters.'
    )
    .required('Mothers name is required')
    .min(5, 'Mothers name at lest 5 character')
    .max(50, 'Mothers name should not be more then 50 character'),
  dob                 : Yup.date().required('Birth Date is required').max(new Date(Date.now() - 567648000000), "You must be at least 18 years"),
  sex                 : Yup.string().required('Sex is required'),
  citizen             : Yup.string().required('Country is required'),
  statement_cycle     : Yup.string(),
  occupation          : Yup.string().matches(
    latinChar,
        'Occupation can only contain Latin letters.'
    ),
  tin                 : Yup.number().required('Tin is required').typeError('Tin should be number'),
  passport_no         : Yup.number().typeError("Passport number must be a number"),
  passport_issue_date : Yup.date().default(() => new Date()).max(new Date(), "Issue date must be before today").nullable(),
  passport_expire_date: Yup.date().min(Yup.ref('passport_issue_date'), "Passport expire date must be after issue!").min( new Date(), "Passport expire date must be after tody!")
  .test(
    "is-equal",
    "Passport expire date must be after issue date!", (value, testContext) => {
      if(!value && !testContext.parent?.passport_issue_date) {
        return true
      } else {
        const exp = new Date(value ?? new Date())
        const issue = new Date(testContext.parent?.passport_issue_date ?? new Date())
        return exp.getTime() > issue.getTime()
      }
    }).nullable(),
  passport_issue_place: Yup.string().matches(
    latinChar,
        'Passport issue place can only contain Latin letters.'
    ), 
  manage_bo           : Yup.bool(),
})

export const BASIC_INFO_INIT_VALUES: BasicInfoInterface = {
  id: null,
  bo_account: '',
  person_type: 'First_Person',
  nid_no_type: 0,
  nid: '',
  name: '',
  father_name: '',
  mother_name: '',
  dob: '',
  sex: '',
  citizen: 'Bangladesh',
  statement_cycle: '',
  occupation: '',
  tin: '',
  passport_no: '',
  passport_issue_date: null,
  passport_expire_date: null,
  passport_issue_place: '',
  manage_bo: true,
}
