/**
 * Project   : Benemoy Securities Web Application
 * Details   : Finish Step - BO Account
 * Author    : BdTask Limited <https://www.bdtask.com>
 * Developers: MMR Ahmad <https://github.com/mmrahmad>
 *           : Ifrat <>
 * Date      : 04-12-2022
 */

import Tabs from './Tabs'
import cogoToast from 'cogo-toast'
import {Modal} from 'react-bootstrap'
import {useLayoutEffect, useState} from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import {
  boTrack,
  finishBo,
  getAddressInfo,
  getBankInfo,
  getBasicInfo,
  getNomineeInfo,
} from '../../auth/core/_requests'

const API_URL = import.meta.env.REACT_APP_API_URL_2

const initialValue = {
  termCondition: '',
}

export function Finish() {
  const [data, setData] = useState<any>(initialValue)
  const [err, setErr] = useState('')
  const [responseErr, setResponseErr] = useState<any>([])
  const [responseErrFields, setResponseErrFields] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [basicData, setBasicData] = useState<any>([])
  const [addressInfo, setAddressInfo] = useState<any>([])
  const [BankInfo, setBankInfo] = useState<any>([])
  const [nomineeData, setNomineeData] = useState<any>([])

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)

  let track_id = localStorage ? localStorage.getItem('bo_track_id') : ''

  const handleSubmit = async (event: any) => {
    const form = event.currentTarget
    setLoading(false)
    event.preventDefault()
    if (form.checkValidity() === false) {
      event.stopPropagation()
      setErr('Please Select the required Field')
    }

    if (form.checkValidity() === true) {
      event.preventDefault()
      let validate = await finishBo(track_id ?? '')

      if (validate?.data?.status === 201 || validate?.data?.status === 200) {
        cogoToast.success('Bo Account Creation is Successful', {position: 'top-right'})
        setErr('')
      } else {
        cogoToast.error('Something went wrong', {position: 'top-right'})
      }
    }
  }
  const fetchData = async () => {
    try {
      let getData: any = []
      if (track_id) {
        getData = await boTrack(track_id)
        if (getData?.data?.status === 200) {
          setData(getData?.data?.data)
        }

        getData = await getBasicInfo(track_id)
        if (getData?.data?.status === 200) {
          setBasicData(getData?.data?.data)
        }

        getData = await getAddressInfo(track_id)
        if (getData?.data?.status === 200) {
          setAddressInfo(getData?.data?.data)
        }

        getData = await getBankInfo(track_id)
        if (getData?.data?.status === 200) {
          setBankInfo(getData?.data?.data)
        }

        getData = await getNomineeInfo(track_id)
        if (getData?.data?.status === 200) {
          setNomineeData(getData?.data?.data)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  useLayoutEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='row g-5 g-xxl-8'>
      <div className='col-md-3'>
        <div className='card h-100'>
          <Tabs />
        </div>
      </div>
      <div className='col-md-9'>
        <div className='card h-100'>
          <div className='card-header border-0 cursor-pointer'>
            <div className='card-title m-0'>Others Info</div>
          </div>

          <form onSubmit={handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9'>
              <sup>
                <a
                  href='#'
                  className='btn btn-sm btn-outline-primary mb-6'
                  data-bs-toggle='modal'
                  data-bs-target='#preview'
                  id='kt_toolbar_primary_button'
                  onClick={(e) => setShow(true)}
                >
                  Preview?
                </a>
              </sup>
              <div className='form-check'>
                <label className='form-check-label required'>Agree to the term & conditions</label>
                <input
                  type='checkbox'
                  className='form-check-input'
                  name='termCondition'
                  required
                  value={1}
                />
              </div>

              {err && (
                <p className='pt-2' style={{color: 'red'}}>
                  {err}
                </p>
              )}

              <Modal show={show} onHide={handleClose} size='lg' backdrop='static'>
                <Modal.Header closeButton>
                  <Modal.Title>Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className='bo-account-step'>
                    <h5 className='pb-2'>DP & BO Type</h5>
                    <div className='table-responsive'>
                      <table className='table table-striped border preview-table'>
                        <tbody>
                          <tr>
                            <th>DP :</th>
                            <td>
                              {/* TODO DP account showing here */}
                              ** DP account **
                            </td>
                          </tr>
                          <tr>
                            <th>Bo Option :</th>
                            <td>{data.bo_option}</td>
                          </tr>
                          <tr>
                            <th>Track Id :</th>
                            <td>{data.bo_track_id}</td>
                          </tr>
                          <tr>
                            <th>Bo Type :</th>
                            <td>{data.bo_type}</td>
                          </tr>
                          <tr>
                            <th>Active :</th>
                            <td>{data.is_active ? 'True' : 'False'}</td>
                          </tr>
                          <tr>
                            <th>Complete</th>
                            <td>{data.is_completed ? 'True' : 'False'}</td>
                          </tr>
                          <tr>
                            <th>Link Account No :</th>
                            <td>{data.link_account_no}</td>
                          </tr>
                          <tr>
                            <th>Residency</th>
                            <td>{data.residency}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className='bo-account-step'>
                    <h5 className='pb-2'>Basic Info </h5>
                    {basicData.map((d: any, k: any) => (
                      <div key={k}>
                        {k < 2 && (
                          <div className='table-responsive' key={k}>
                            <table className='table table-striped border preview-table'>
                              <tbody>
                                <tr>
                                  <th> Person Type :</th>
                                  <td>{d.person_type}</td>
                                </tr>
                                <tr>
                                  <th>NID :</th>
                                  <td>{d.nid}</td>
                                </tr>
                                <tr>
                                  <th>Name :</th>
                                  <td>{d.name}</td>
                                </tr>
                                <tr>
                                  <th>Father / Husband :</th>
                                  <td>{d.father_name}</td>
                                </tr>
                                <tr>
                                  <th>Mother :</th>
                                  <td>{d.mother_name}</td>
                                </tr>
                                <tr>
                                  <th>Date Of birth :</th>
                                  <td>{d.dob}</td>
                                </tr>
                                <tr>
                                  <th>Sex :</th>
                                  <td>{d.sex}</td>
                                </tr>
                                <tr>
                                  <th>Citizen :</th>
                                  <td>{d.citizen}</td>
                                </tr>
                                <tr>
                                  <th>Occupation :</th>
                                  <td>{d.occupation}</td>
                                </tr>
                                <tr>
                                  <th>Statement Cycle :</th>
                                  <td>{d.statement_cycle}</td>
                                </tr>
                                <tr>
                                  <th>Tin :</th>
                                  <td> {d.tin}</td>
                                </tr>
                                <tr>
                                  <th>Passport Expire Date :</th>
                                  <td>{d.passport_expire_date}</td>
                                </tr>
                                <tr>
                                  <th>Passport Issue Date :</th>
                                  <td>{d.passport_issue_date}</td>
                                </tr>
                                <tr>
                                  <th>Passport Issue Place :</th>
                                  <td>{d.passport_issue_place}</td>
                                </tr>
                                <tr>
                                  <th>Passport No :</th>
                                  <td>{d.passport_no}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className='bo-account-step'>
                    <h5 className='pb-2'>Address </h5>
                    <div className='table-responsive'>
                      <table className='table table-striped border preview-table'>
                        <tbody>
                          <tr>
                            <th>Permanent Address :</th>
                            <td>{addressInfo.permanant_address}</td>
                          </tr>
                          <tr>
                            <th>Present Address :</th>
                            <td>{addressInfo.present_address_line1}</td>
                          </tr>
                          <tr>
                            <th>Present Address 2 :</th>
                            <td>{addressInfo.present_address_line2}</td>
                          </tr>
                          <tr>
                            <th>Present Address 3 :</th>
                            <td>{addressInfo.present_address_line3}</td>
                          </tr>
                          <tr>
                            <th>City :</th>
                            <td>{addressInfo.city}</td>
                          </tr>
                          <tr>
                            <th>State :</th>
                            <td>{addressInfo.state}</td>
                          </tr>
                          <tr>
                            <th>Contract 1 :</th>
                            <td>{addressInfo.contract1}</td>
                          </tr>
                          <tr>
                            <th>Contract 2 :</th>
                            <td>{addressInfo.contract2}</td>
                          </tr>
                          <tr>
                            <th>Country :</th>
                            <td>{addressInfo.country}</td>
                          </tr>
                          <tr>
                            <th>Email :</th>
                            <td>{addressInfo.email}</td>
                          </tr>
                          <tr>
                            <th>Fax :</th>
                            <td>{addressInfo.fax}</td>
                          </tr>
                          <tr>
                            <th>Phone : </th>
                            <td>{addressInfo.phone}</td>
                          </tr>
                          <tr>
                            <th> Postcode :</th>
                            <td>{addressInfo.postcode}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className='bo-account-step'>
                    <h5 className='pb-2'>Bank Details </h5>
                    <div className='table-responsive'>
                      <table className='table table-striped border preview-table'>
                        <tbody>
                          <tr>
                            <th>Account No :</th>
                            <td>{BankInfo?.b_account_no}</td>
                          </tr>
                          <tr>
                            <th>Address :</th>
                            <td>{BankInfo?.b_address}</td>
                          </tr>
                          <tr>
                            <th>Branch :</th>
                            <td>{BankInfo?.b_branch_name}</td>
                          </tr>
                          <tr>
                            <th>Bank Name :</th>
                            <td>{BankInfo?.b_name}</td>
                          </tr>
                          <tr>
                            <th>Route :</th>
                            <td>{BankInfo?.b_routing_no}</td>
                          </tr>
                          <tr>
                            <th>Account Holder Photo :</th>
                            <td>
                              <img
                                src={API_URL + BankInfo?.account_holder_photo}
                                alt=''
                                width='30%'
                              />
                            </td>
                          </tr>
                          <tr>
                            <th>Account Holder Signature :</th>
                            <td>
                              <img
                                src={API_URL + BankInfo?.account_holder_signeture}
                                alt=''
                                width='30%'
                              />
                            </td>
                          </tr>
                          <tr>
                            <th>Cheque Book pic :</th>
                            <td>
                              <img src={API_URL + BankInfo?.cheque_book_copy} alt='' width='30%' />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {BankInfo?.is_nominee && (
                    <div className='bo-account-step'>
                      <h5 className='pb-2'>Nominees</h5>
                      {nomineeData.map((d: any, k: any) => (
                        <div key={k}>
                          {k < 2 && (
                            <div className='table-responsive' key={k}>
                              <table className='table table-striped border preview-table'>
                                <tbody>
                                  <tr>
                                    <th>NID :</th>
                                    <td>{d.nid}</td>
                                  </tr>
                                  <tr>
                                    <th>Name :</th>
                                    <td>{d.name}</td>
                                  </tr>
                                  <tr>
                                    <th>Father :</th>
                                    <td>{d.father_name}</td>
                                  </tr>
                                  <tr>
                                    <th> Mother :</th>
                                    <td>{d.mother_name}</td>
                                  </tr>
                                  <tr>
                                    <th>Date Of birth :</th>
                                    <td> {d.dob}</td>
                                  </tr>
                                  <tr>
                                    <th>Sex :</th>
                                    <td>{d.sex}</td>
                                  </tr>
                                  <tr>
                                    <th>Percentage :</th>
                                    <td>{d.percentage}</td>
                                  </tr>
                                  <tr>
                                    <th>Relation With Applicant :</th>
                                    <td>{d.relation_with_applicant}</td>
                                  </tr>
                                  <tr>
                                    <th>Citizen / Residence</th>
                                    <td>{d.country}</td>
                                  </tr>
                                  <tr>
                                    <th>Address :</th>
                                    <td>{d.address1}</td>
                                  </tr>
                                  <tr>
                                    <th>Address 2 :</th>
                                    <td>{d.address2}</td>
                                  </tr>
                                  <tr>
                                    <th>Address 3 :</th>
                                    <td>{d.address3}</td>
                                  </tr>
                                  <tr>
                                    <th>City :</th>
                                    <td>{d.city}</td>
                                  </tr>
                                  <tr>
                                    <th>Nominee's State/Division :</th>
                                    <td> {d.state}</td>
                                  </tr>
                                  <tr>
                                    <th>PostCode / ZipCode :</th>
                                    <td>{d.postcode}</td>
                                  </tr>
                                  <tr>
                                    <th>Phone :</th>
                                    <td>{d.phone}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <p></p>
                </Modal.Body>
              </Modal>

              {responseErrFields.length > 0 && (
                <div className='row mb-6'>
                  <div className='col-lg-12'>
                    <div className='mb-10'>
                      All Error
                      <div className='row'>
                        {responseErrFields.map((collection: any, key: any) => (
                          <ul key={key}>
                            {collection?.toUpperCase().replaceAll('_', ' ')}
                            <ul>
                              {responseErr[collection].map((collection_2: any, key_2: any) => (
                                <li key={key_2} style={{color: 'red'}}>
                                  {' '}
                                  {collection_2.replaceAll('_', ' ')}{' '}
                                </li>
                              ))}
                            </ul>
                          </ul>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className='card-footer d-flex justify-content-end py-6 px-9'>
              <button type='submit' className='btn btn-outline-primary' disabled={loading}>
                {!loading && 'Finish'}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...{' '}
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
