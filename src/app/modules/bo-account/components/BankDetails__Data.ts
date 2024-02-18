/**
 * Project   : Benemoy Securities Web Application
 * Details   : Bank Details Data - BO Account
 * Author    : BdTask Limited <https://www.bdtask.com>
 * Developers: MMR Ahmad <https://github.com/mmrahmad>
 *           : Ifrat <>
 * Date      : 01-12-2022
 */

import * as Yup from 'yup'

const latinChar = /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi

export const bankDetailsSchema = Yup.object().shape({
  b_name: Yup.string()
    .required('Bank name is required!')
    .matches(latinChar, 'Only contain Latin letters.'),
  b_routing_no: Yup.number().required('Bank routing number is required!'),
  b_branch_name: Yup.string()
    .required('Bank branch name is required!')
    .matches(latinChar, 'Only contain Latin letters.'),
  b_address: Yup.string()
    .required('Bank address is required!')
    .matches(latinChar, 'Only contain Latin letters.'),
  b_account_no: Yup.number().required('Bank account number is required!'),
  bo_account: Yup.number().optional(),
  bo_option: Yup.string(),
  is_nominee: Yup.bool().required(),
})

export interface BankDetailsInterface {
  b_name: string
  b_routing_no: string
  b_branch_name: string
  b_address: string
  b_account_no: string
  bo_account: string
  bo_option: string
  is_nominee: boolean
}

export const bankDetailsInitValues: BankDetailsInterface = {
  b_name: '',
  b_routing_no: '',
  b_branch_name: '',
  b_address: '',
  b_account_no: '',
  bo_account: '',
  bo_option: 'yes',
  is_nominee: false,
}

export interface UploadInitialValueInterface {
  cheque_book_copy: string
  account_holder_photo: string
  account_holder_signature: string
}

export const uploadInitialValue: UploadInitialValueInterface = {
  cheque_book_copy: '',
  account_holder_photo: '',
  account_holder_signature: '',
}
