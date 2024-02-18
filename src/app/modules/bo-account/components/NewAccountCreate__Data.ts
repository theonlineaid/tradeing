/**
 * Project   : Benemoy Securities Web Application
 * Details   : DP & BO Type DATA - BO Account
 * Author    : BdTask Limited <https://www.bdtask.com>
 * Developers: MMR Ahmad <https://github.com/mmrahmad>
 * Date      : 29-11-2022
 */

import * as Yup from 'yup'

export interface NewAccValInterface {
  dp: string
  bo_option: string
  residency: string
  bo_type: string
  link_account_no: string
}

export const newAccValidationSchema = Yup.object().shape({
  dp: Yup.string().required('Please select an DP account'),
  bo_option: Yup.string().required(),
  residency: Yup.string().required(),
  bo_type: Yup.string().required(),
  link_account_no: Yup.string().when(['bo_option'], {
    is: (bo_option) => bo_option === 'Link_BO',
    then: (schema) => schema.required('Link BO Account Required!'),
    otherwise: (schema) => schema.optional(),
  }),
})

export const NEW_ACC_INIT_VALUE: NewAccValInterface = {
  dp: '',
  bo_option: 'New_BO',
  residency: 'Bangladesh',
  bo_type: 'Individual',
  link_account_no: '',
}
