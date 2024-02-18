import MyTooltip from '../../../common/components/ui/MyTooltip'
import {useRef, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {Tooltip} from 'react-hover-tooltip'
import {OrderListDSC} from '../../tws/components/OrderListDSC'
// import 'bootstrap/dist/css/bootstrap.min.css'

export function List() {
  const [tab1, settab1] = useState<any>(true)
  const [tab2, settab2] = useState<any>(false)
  const [tab3, settab3] = useState<any>(false)
  const [tab4, settab4] = useState<any>(false)
  const stepperRef = useRef<HTMLDivElement | null>(null)

  const [tabauthorization, settabauthorization] = useState<any>(true)
  const [tablimits, settablimits] = useState<any>(false)
  const [tabconnection, settabconnection] = useState<any>(false)
  const [tabidentity, settabidentity] = useState<any>(false)
  const [show, setShow] = useState(false)
  const [show_2, setShow_2] = useState(false)
  const handleClose = () => setShow(false)
  const handleClose_2 = () => setShow_2(false)

  return (
    <>
      <div className='container'>
        <div className='card rounded-2'>
          <div className='card-header mb-2'>
            <h3 className='card-title ms-4'>Credit</h3>
            <div className='card-toolbar'>
              <ul className='dark-bg nav nav-tabs nav-line-tabs nav-line-tabs-2x nav-stretch border-0 font-6'>
                <li
                  className='nav-item'
                  onClick={(e) => {
                    settab1(true)
                    settab2(false)
                    settab3(false)
                    settab4(false)
                  }}
                >
                  <a
                    className={tab1 ? 'nav-link font-bold active' : 'nav-link font-bold'}
                    data-bs-toggle='tab'
                    href='#kt_tab_pane_1'
                  >
                    DSC Panel
                  </a>
                </li>
                <li
                  className='nav-item'
                  onClick={(e) => {
                    settab1(false)
                    settab2(true)
                    settab3(false)
                    settab4(false)
                  }}
                >
                  <a
                    className={tab2 ? 'nav-link font-bold active' : 'nav-link font-bold'}
                    data-bs-toggle='tab'
                    href='#kt_tab_pane_2'
                  >
                    User
                  </a>
                </li>
                <li
                  className='nav-item'
                  onClick={(e) => {
                    settab1(false)
                    settab2(false)
                    settab3(true)
                    settab4(false)
                  }}
                >
                  <a
                    className={tab3 ? 'nav-link font-bold active' : 'nav-link font-bold'}
                    data-bs-toggle='tab'
                    href='#kt_tab_pane_3'
                  >
                    Branch
                  </a>
                </li>
                <li
                  className='nav-item'
                  onClick={(e) => {
                    settab1(false)
                    settab2(false)
                    settab3(false)
                    settab4(true)
                  }}
                >
                  <a
                    className={tab4 ? 'nav-link font-bold active' : 'nav-link font-bold'}
                    data-bs-toggle='tab'
                    href='#kt_tab_pane_4'
                  >
                    Broker
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className='card-body'>
            {tab1 && (
              <>
                <div className='card-custom'>
                  <div
                    className='subheader py-5 py-lg-10 gutter-b subheader-transparent mb-10 rounded-2'
                    id='kt_subheader'
                  >
                    <div className='container d-flex flex-column px-5'>
                      {/*begin::Title*/}
                      <div className='d-flex align-items-sm-end flex-column flex-sm-row mb-3'>
                        <h4 className='d-flex align-items-center text-white mr-5 mb-0'>
                          Search Credit
                        </h4>
                      </div>
                      {/*end::Title*/}
                      {/*begin::Search Bar*/}
                      <div className='d-flex align-items-md-center mb-2 flex-column flex-md-row'>
                        <div className='bg-white rounded-border p-3 d-flex flex-grow-1 flex-sm-grow-0'>
                          {/*begin::Form*/}
                          <form className='form d-flex align-items-md-center flex-sm-row flex-column flex-grow-1 flex-sm-grow-0'>
                            {/*begin::Input*/}
                            <div className='d-flex align-items-center py-3 py-sm-0 px-sm-3'>
                              <span className='svg-icon svg-icon-primary svg-icon-2x'>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  xmlnsXlink='http://www.w3.org/1999/xlink'
                                  width='24px'
                                  height='24px'
                                  viewBox='0 0 24 24'
                                  version='1.1'
                                >
                                  <g stroke='none' strokeWidth={1} fill='none' fillRule='evenodd'>
                                    <rect x={0} y={0} width={24} height={24} />
                                    <polygon
                                      fill='currentColor'
                                      opacity='0.3'
                                      transform='translate(8.885842, 16.114158) rotate(-315.000000) translate(-8.885842, -16.114158) '
                                      points='6.89784488 10.6187476 6.76452164 19.4882481 8.88584198 21.6095684 11.0071623 19.4882481 9.59294876 18.0740345 10.9659914 16.7009919 9.55177787 15.2867783 11.0071623 13.8313939 10.8837471 10.6187476'
                                    />
                                    <path
                                      d='M15.9852814,14.9852814 C12.6715729,14.9852814 9.98528137,12.2989899 9.98528137,8.98528137 C9.98528137,5.67157288 12.6715729,2.98528137 15.9852814,2.98528137 C19.2989899,2.98528137 21.9852814,5.67157288 21.9852814,8.98528137 C21.9852814,12.2989899 19.2989899,14.9852814 15.9852814,14.9852814 Z M16.1776695,9.07106781 C17.0060967,9.07106781 17.6776695,8.39949494 17.6776695,7.57106781 C17.6776695,6.74264069 17.0060967,6.07106781 16.1776695,6.07106781 C15.3492424,6.07106781 14.6776695,6.74264069 14.6776695,7.57106781 C14.6776695,8.39949494 15.3492424,9.07106781 16.1776695,9.07106781 Z'
                                      fill='currentColor'
                                      transform='translate(15.985281, 8.985281) rotate(-315.000000) translate(-15.985281, -8.985281) '
                                    />
                                  </g>
                                </svg>
                                {/*end::Svg Icon*/}
                              </span>
                              <input
                                type='text'
                                className='form-control border-0 font-weight-bold pl-2'
                                placeholder='Client A/C'
                              />
                            </div>
                            {/*end::Input*/}
                            {/*begin::Input*/}
                            <span className='bullet bullet-ver h-25px d-none d-sm-flex mr-2' />
                            <div className='d-flex align-items-center py-3 py-sm-0 px-sm-3'>
                              <span className='svg-icon svg-icon-primary svg-icon-2x'>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  xmlnsXlink='http://www.w3.org/1999/xlink'
                                  width='24px'
                                  height='24px'
                                  viewBox='0 0 24 24'
                                  version='1.1'
                                >
                                  <g stroke='none' strokeWidth={1} fill='none' fillRule='evenodd'>
                                    <rect x={0} y={0} width={24} height={24} />
                                    <path
                                      d='M3,16 L5,16 C5.55228475,16 6,15.5522847 6,15 C6,14.4477153 5.55228475,14 5,14 L3,14 L3,12 L5,12 C5.55228475,12 6,11.5522847 6,11 C6,10.4477153 5.55228475,10 5,10 L3,10 L3,8 L5,8 C5.55228475,8 6,7.55228475 6,7 C6,6.44771525 5.55228475,6 5,6 L3,6 L3,4 C3,3.44771525 3.44771525,3 4,3 L10,3 C10.5522847,3 11,3.44771525 11,4 L11,19 C11,19.5522847 10.5522847,20 10,20 L4,20 C3.44771525,20 3,19.5522847 3,19 L3,16 Z'
                                      fill='currentColor'
                                      opacity='0.3'
                                    />
                                    <path
                                      d='M16,3 L19,3 C20.1045695,3 21,3.8954305 21,5 L21,15.2485298 C21,15.7329761 20.8241635,16.200956 20.5051534,16.565539 L17.8762883,19.5699562 C17.6944473,19.7777745 17.378566,19.7988332 17.1707477,19.6169922 C17.1540423,19.602375 17.1383289,19.5866616 17.1237117,19.5699562 L14.4948466,16.565539 C14.1758365,16.200956 14,15.7329761 14,15.2485298 L14,5 C14,3.8954305 14.8954305,3 16,3 Z'
                                      fill='currentColor'
                                    />
                                  </g>
                                </svg>
                                {/*end::Svg Icon*/}
                              </span>
                              <input
                                type='text'
                                className='form-control border-0 font-weight-bold pl-2'
                                placeholder='Name'
                              />
                            </div>
                            {/*end::Input*/}
                            {/*begin::Input*/}
                            <span className='bullet bullet-ver h-25px d-none d-sm-flex mr-2' />
                            <div className='d-flex align-items-center py-3 py-sm-0 px-sm-3'>
                              <span className='svg-icon svg-icon-primary svg-icon-2x'>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  xmlnsXlink='http://www.w3.org/1999/xlink'
                                  width='24px'
                                  height='24px'
                                  viewBox='0 0 24 24'
                                  version='1.1'
                                >
                                  <g stroke='none' strokeWidth={1} fill='none' fillRule='evenodd'>
                                    <polygon points='0 0 24 0 24 24 0 24' />
                                    <path
                                      d='M12,11 C9.790861,11 8,9.209139 8,7 C8,4.790861 9.790861,3 12,3 C14.209139,3 16,4.790861 16,7 C16,9.209139 14.209139,11 12,11 Z'
                                      fill='currentColor'
                                      fillRule='nonzero'
                                      opacity='0.3'
                                    />
                                    <path
                                      d='M3.00065168,20.1992055 C3.38825852,15.4265159 7.26191235,13 11.9833413,13 C16.7712164,13 20.7048837,15.2931929 20.9979143,20.2 C21.0095879,20.3954741 20.9979143,21 20.2466999,21 C16.541124,21 11.0347247,21 3.72750223,21 C3.47671215,21 2.97953825,20.45918 3.00065168,20.1992055 Z'
                                      fill='currentColor'
                                      fillRule='nonzero'
                                    />
                                  </g>
                                </svg>
                                {/*end::Svg Icon*/}
                              </span>
                              <input
                                type='text'
                                className='form-control border-0 font-weight-bold pl-2'
                                placeholder='Dealer'
                              />
                            </div>
                            <span className='bullet bullet-ver h-25px d-none d-sm-flex mr-2' />
                            <div className='d-flex align-items-center py-3 py-sm-0 px-sm-3'>
                              <span className='svg-icon svg-icon-primary svg-icon-2x'>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  xmlnsXlink='http://www.w3.org/1999/xlink'
                                  width='24px'
                                  height='24px'
                                  viewBox='0 0 24 24'
                                  version='1.1'
                                >
                                  <g stroke='none' strokeWidth={1} fill='none' fillRule='evenodd'>
                                    <rect x={0} y={0} width={24} height={24} />
                                    <path
                                      d='M5.5,4 L9.5,4 C10.3284271,4 11,4.67157288 11,5.5 L11,6.5 C11,7.32842712 10.3284271,8 9.5,8 L5.5,8 C4.67157288,8 4,7.32842712 4,6.5 L4,5.5 C4,4.67157288 4.67157288,4 5.5,4 Z M14.5,16 L18.5,16 C19.3284271,16 20,16.6715729 20,17.5 L20,18.5 C20,19.3284271 19.3284271,20 18.5,20 L14.5,20 C13.6715729,20 13,19.3284271 13,18.5 L13,17.5 C13,16.6715729 13.6715729,16 14.5,16 Z'
                                      fill='currentColor'
                                    />
                                    <path
                                      d='M5.5,10 L9.5,10 C10.3284271,10 11,10.6715729 11,11.5 L11,18.5 C11,19.3284271 10.3284271,20 9.5,20 L5.5,20 C4.67157288,20 4,19.3284271 4,18.5 L4,11.5 C4,10.6715729 4.67157288,10 5.5,10 Z M14.5,4 L18.5,4 C19.3284271,4 20,4.67157288 20,5.5 L20,12.5 C20,13.3284271 19.3284271,14 18.5,14 L14.5,14 C13.6715729,14 13,13.3284271 13,12.5 L13,5.5 C13,4.67157288 13.6715729,4 14.5,4 Z'
                                      fill='currentColor'
                                      opacity='0.3'
                                    />
                                  </g>
                                </svg>
                                {/*end::Svg Icon*/}
                              </span>
                              <select
                                className='form-select border-0'
                                data-control='select2'
                                data-placeholder='Branch'
                                data-hide-search='true'
                              >
                                <option>Branch</option>
                                <option value={1}>Option 1</option>
                                <option value={2}>Option 2</option>
                                <option value={3}>Option 3</option>
                                <option value={4}>Option 4</option>
                                <option value={5}>Option 5</option>
                              </select>
                            </div>
                            <button
                              type='submit'
                              className='btn btn-dark font-weight-bold rounded-border btn-hover-light-primary mt-3 mt-sm-0 px-7'
                            >
                              Search
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-12'>
                      <div className='table-responsive'>
                        <OrderListDSC />
                      </div>
                    </div>
                  </div>
                </div>

                <Modal show={show} onHide={handleClose} size='lg' backdrop='static'>
                  <Modal.Header closeButton>
                    <Modal.Title>MD. Mubin</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className='table-responsive'>
                      <table className='table table-rounded table-striped border g-3 mb-8'>
                        <thead>
                          <tr className='fw-bold fs-6 text-gray-800'>
                            <th className='min-w-50px'>Small</th>
                            <th className='min-w-100px'>Cap Board</th>
                            <th className='min-w-100px'>Initial Limit</th>
                            <th className='min-w-100px'>(%)</th>
                            <th className='min-w-100px'>Day Order</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <div className='form-check form-check-custom form-check-sm'>
                                <input className='form-check-input' type='checkbox' />
                              </div>
                            </td>
                            <td>Max Capital Buy</td>
                            <td>
                              <input
                                type='text'
                                className='form-control form-control-sm'
                                id='row-1-age'
                                name='row-1-age'
                                defaultValue={61}
                              />
                            </td>
                            <td>
                              <input
                                type='text'
                                className='form-control form-control-sm'
                                id='row-1-position'
                                name='row-1-position'
                                defaultValue={0}
                              />
                            </td>
                            <td>0</td>
                          </tr>
                          <tr>
                            <td>
                              <div className='form-check form-check-custom form-check-sm'>
                                <input className='form-check-input' type='checkbox' />
                              </div>
                            </td>
                            <td>Max Capital Buy</td>
                            <td>
                              <input
                                type='text'
                                className='form-control form-control-sm'
                                id='row-1-age'
                                name='row-1-age'
                                defaultValue={61}
                              />
                            </td>
                            <td>
                              <input
                                type='text'
                                className='form-control form-control-sm'
                                id='row-1-position'
                                name='row-1-position'
                                defaultValue={0}
                              />
                            </td>
                            <td>0</td>
                          </tr>
                          <tr>
                            <td>
                              <div className='form-check form-check-custom form-check-sm'>
                                <input className='form-check-input' type='checkbox' />
                              </div>
                            </td>
                            <td>Max Capital Buy</td>
                            <td>
                              <input
                                type='text'
                                className='form-control form-control-sm'
                                id='row-1-age'
                                name='row-1-age'
                                defaultValue={61}
                              />
                            </td>
                            <td>
                              <input
                                type='text'
                                className='form-control form-control-sm'
                                id='row-1-position'
                                name='row-1-position'
                                defaultValue={0}
                              />
                            </td>
                            <td>0</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className='d-flex justify-content-between mb-3'>
                      <h5 className='fw-medium mb-0'>Cash Limit (BDT)</h5>
                      <span className=' text-primary'>Day Order : -128685</span>
                    </div>
                    <div className='table-responsive'>
                      <table className='table table-rounded table-striped border g-3 mb-8'>
                        <thead>
                          <tr className='fw-bold fs-6 text-gray-800'>
                            <th className='min-w-50px'>Small</th>
                            <th className='min-w-100px'>Cap Board</th>
                            <th className='min-w-100px'>Initial Limit</th>
                            <th className='min-w-100px'>(%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <div className='form-check form-check-custom form-check-sm'>
                                <input
                                  className='form-check-input'
                                  type='checkbox'
                                  id='flexCheckDefault'
                                />
                              </div>
                            </td>
                            <td>
                              <input
                                type='text'
                                className='form-control form-control-sm'
                                id='row-1-age'
                                name='row-1-age'
                                defaultValue={61}
                              />
                            </td>
                            <td>
                              <input
                                type='text'
                                className='form-control form-control-sm'
                                id='row-1-position'
                                name='row-1-position'
                                defaultValue='System Architect'
                              />
                            </td>
                            <td>0</td>
                          </tr>
                          <tr>
                            <td>Garrett Winters</td>
                            <td>
                              <input
                                type='text'
                                className='form-control form-control-sm'
                                id='row-2-age'
                                name='row-2-age'
                                defaultValue={63}
                              />
                            </td>
                            <td>
                              <input
                                type='text'
                                className='form-control form-control-sm'
                                id='row-2-position'
                                name='row-2-position'
                                defaultValue='Accountant'
                              />
                            </td>
                            <td>0</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <h5 className='mb-3'>Suspension</h5>
                    <div className=' row'>
                      <label htmlFor='exampleFormControlInput1' className='form-label col-md-4'>
                        Suspension Remark
                      </label>
                      <div className='col-md-8'>
                        <div className='d-flex flex-wrap mb-3'>
                          <div className='form-check form-check-custom form-check-sm'>
                            <input
                              className='form-check-input'
                              type='checkbox'
                              id='inlineCheckbox1'
                              defaultValue='option1'
                            />
                            <label className='form-check-label' htmlFor='inlineCheckbox1'>
                              Suspend BUY
                            </label>
                          </div>
                          <div className='form-check form-check-custom form-check-sm ms-3'>
                            <input
                              className='form-check-input'
                              type='checkbox'
                              id='inlineCheckbox2'
                              defaultValue='option2'
                            />
                            <label className='form-check-label' htmlFor='inlineCheckbox2'>
                              Suspend SELL
                            </label>
                          </div>
                        </div>
                        <textarea
                          className='form-control'
                          id='exampleFormControlTextarea1'
                          rows={3}
                          defaultValue={''}
                        />
                        <div className='form-check form-check-custom form-check-sm mt-3'>
                          <input
                            className='form-check-input'
                            type='checkbox'
                            id='shortSellAllowed'
                          />
                          <label className='form-check-label' htmlFor='shortSellAllowed'>
                            Short Sell Allowed
                          </label>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant='light' onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant='primary' onClick={handleClose}>
                      Save Changes
                    </Button>
                  </Modal.Footer>
                </Modal>
              </>
            )}
            {tab2 && (
              <>
                <div className='card card-custom'>
                  <div className='card-body'>
                    <div
                      className='subheader py-5 py-lg-10 gutter-b subheader-transparent mb-10 rounded-2'
                      id='kt_subheader'
                    >
                      <div className='container d-flex flex-column px-5'>
                        {/*begin::Title*/}
                        <div className='d-flex align-items-sm-end flex-column flex-sm-row mb-3'>
                          <h4 className='d-flex align-items-center text-white mr-5 mb-0'>
                            Search Credit
                          </h4>
                        </div>
                        {/*end::Title*/}
                        {/*begin::Search Bar*/}
                        <div className='d-flex align-items-md-center mb-2 flex-column flex-md-row'>
                          <div className='bg-white rounded-border p-3 d-flex flex-grow-1 flex-sm-grow-0'>
                            {/*begin::Form*/}
                            <form className='form d-flex align-items-md-center flex-sm-row flex-column flex-grow-1 flex-sm-grow-0'>
                              {/*begin::Input*/}
                              <div className='d-flex align-items-center py-3 py-sm-0 px-sm-3'>
                                <span className='svg-icon svg-icon-primary svg-icon-2x'>
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    xmlnsXlink='http://www.w3.org/1999/xlink'
                                    width='24px'
                                    height='24px'
                                    viewBox='0 0 24 24'
                                    version='1.1'
                                  >
                                    <g stroke='none' strokeWidth={1} fill='none' fillRule='evenodd'>
                                      <rect x={0} y={0} width={24} height={24} />
                                      <polygon
                                        fill='currentColor'
                                        opacity='0.3'
                                        transform='translate(8.885842, 16.114158) rotate(-315.000000) translate(-8.885842, -16.114158) '
                                        points='6.89784488 10.6187476 6.76452164 19.4882481 8.88584198 21.6095684 11.0071623 19.4882481 9.59294876 18.0740345 10.9659914 16.7009919 9.55177787 15.2867783 11.0071623 13.8313939 10.8837471 10.6187476'
                                      />
                                      <path
                                        d='M15.9852814,14.9852814 C12.6715729,14.9852814 9.98528137,12.2989899 9.98528137,8.98528137 C9.98528137,5.67157288 12.6715729,2.98528137 15.9852814,2.98528137 C19.2989899,2.98528137 21.9852814,5.67157288 21.9852814,8.98528137 C21.9852814,12.2989899 19.2989899,14.9852814 15.9852814,14.9852814 Z M16.1776695,9.07106781 C17.0060967,9.07106781 17.6776695,8.39949494 17.6776695,7.57106781 C17.6776695,6.74264069 17.0060967,6.07106781 16.1776695,6.07106781 C15.3492424,6.07106781 14.6776695,6.74264069 14.6776695,7.57106781 C14.6776695,8.39949494 15.3492424,9.07106781 16.1776695,9.07106781 Z'
                                        fill='currentColor'
                                        transform='translate(15.985281, 8.985281) rotate(-315.000000) translate(-15.985281, -8.985281) '
                                      />
                                    </g>
                                  </svg>
                                  {/*end::Svg Icon*/}
                                </span>
                                <input
                                  type='text'
                                  className='form-control border-0 font-weight-bold pl-2'
                                  placeholder='Login'
                                />
                              </div>
                              {/*end::Input*/}
                              {/*begin::Input*/}
                              <span className='bullet bullet-ver h-25px d-none d-sm-flex mr-2' />
                              <div className='d-flex align-items-center py-3 py-sm-0 px-sm-3'>
                                <span className='svg-icon svg-icon-primary svg-icon-2x'>
                                  {/*begin::Svg Icon | path:/var/www/preview.keenthemes.com/metronic/releases/2021-05-14-112058/theme/html/demo1/dist/../src/media/svg/icons/Design/PenAndRuller.svg*/}
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    xmlnsXlink='http://www.w3.org/1999/xlink'
                                    width='24px'
                                    height='24px'
                                    viewBox='0 0 24 24'
                                    version='1.1'
                                  >
                                    <g stroke='none' strokeWidth={1} fill='none' fillRule='evenodd'>
                                      <rect x={0} y={0} width={24} height={24} />
                                      <path
                                        d='M3,16 L5,16 C5.55228475,16 6,15.5522847 6,15 C6,14.4477153 5.55228475,14 5,14 L3,14 L3,12 L5,12 C5.55228475,12 6,11.5522847 6,11 C6,10.4477153 5.55228475,10 5,10 L3,10 L3,8 L5,8 C5.55228475,8 6,7.55228475 6,7 C6,6.44771525 5.55228475,6 5,6 L3,6 L3,4 C3,3.44771525 3.44771525,3 4,3 L10,3 C10.5522847,3 11,3.44771525 11,4 L11,19 C11,19.5522847 10.5522847,20 10,20 L4,20 C3.44771525,20 3,19.5522847 3,19 L3,16 Z'
                                        fill='currentColor'
                                        opacity='0.3'
                                      />
                                      <path
                                        d='M16,3 L19,3 C20.1045695,3 21,3.8954305 21,5 L21,15.2485298 C21,15.7329761 20.8241635,16.200956 20.5051534,16.565539 L17.8762883,19.5699562 C17.6944473,19.7777745 17.378566,19.7988332 17.1707477,19.6169922 C17.1540423,19.602375 17.1383289,19.5866616 17.1237117,19.5699562 L14.4948466,16.565539 C14.1758365,16.200956 14,15.7329761 14,15.2485298 L14,5 C14,3.8954305 14.8954305,3 16,3 Z'
                                        fill='currentColor'
                                      />
                                    </g>
                                  </svg>
                                  {/*end::Svg Icon*/}
                                </span>
                                <input
                                  type='text'
                                  className='form-control border-0 font-weight-bold pl-2'
                                  placeholder='Branch'
                                />
                              </div>
                              {/*end::Input*/}
                              {/*begin::Input*/}
                              <span className='bullet bullet-ver h-25px d-none d-sm-flex mr-2' />
                              <div className='d-flex align-items-center py-3 py-sm-0 px-sm-3'>
                                <span className='svg-icon svg-icon-primary svg-icon-2x'>
                                  {/*begin::Svg Icon | path:/var/www/preview.keenthemes.com/metronic/releases/2021-05-14-112058/theme/html/demo1/dist/../src/media/svg/icons/General/User.svg*/}
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    xmlnsXlink='http://www.w3.org/1999/xlink'
                                    width='24px'
                                    height='24px'
                                    viewBox='0 0 24 24'
                                    version='1.1'
                                  >
                                    <g stroke='none' strokeWidth={1} fill='none' fillRule='evenodd'>
                                      <polygon points='0 0 24 0 24 24 0 24' />
                                      <path
                                        d='M12,11 C9.790861,11 8,9.209139 8,7 C8,4.790861 9.790861,3 12,3 C14.209139,3 16,4.790861 16,7 C16,9.209139 14.209139,11 12,11 Z'
                                        fill='currentColor'
                                        fillRule='nonzero'
                                        opacity='0.3'
                                      />
                                      <path
                                        d='M3.00065168,20.1992055 C3.38825852,15.4265159 7.26191235,13 11.9833413,13 C16.7712164,13 20.7048837,15.2931929 20.9979143,20.2 C21.0095879,20.3954741 20.9979143,21 20.2466999,21 C16.541124,21 11.0347247,21 3.72750223,21 C3.47671215,21 2.97953825,20.45918 3.00065168,20.1992055 Z'
                                        fill='currentColor'
                                        fillRule='nonzero'
                                      />
                                    </g>
                                  </svg>
                                  {/*end::Svg Icon*/}
                                </span>
                                <input
                                  type='text'
                                  className='form-control border-0 font-weight-bold pl-2'
                                  placeholder='Status'
                                />
                              </div>
                              {/*end::Input*/}
                              {/*begin::Input*/}
                              <span className='bullet bullet-ver h-25px d-none d-sm-flex mr-2' />
                              <div className='d-flex align-items-center py-3 py-sm-0 px-sm-3'>
                                <span className='svg-icon svg-icon-primary svg-icon-2x'>
                                  {/*begin::Svg Icon | path:/var/www/preview.keenthemes.com/metronic/releases/2021-05-14-112058/theme/html/demo1/dist/../src/media/svg/icons/Layout/Layout-arrange.svg*/}
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    xmlnsXlink='http://www.w3.org/1999/xlink'
                                    width='24px'
                                    height='24px'
                                    viewBox='0 0 24 24'
                                    version='1.1'
                                  >
                                    <g stroke='none' strokeWidth={1} fill='none' fillRule='evenodd'>
                                      <rect x={0} y={0} width={24} height={24} />
                                      <path
                                        d='M5.5,4 L9.5,4 C10.3284271,4 11,4.67157288 11,5.5 L11,6.5 C11,7.32842712 10.3284271,8 9.5,8 L5.5,8 C4.67157288,8 4,7.32842712 4,6.5 L4,5.5 C4,4.67157288 4.67157288,4 5.5,4 Z M14.5,16 L18.5,16 C19.3284271,16 20,16.6715729 20,17.5 L20,18.5 C20,19.3284271 19.3284271,20 18.5,20 L14.5,20 C13.6715729,20 13,19.3284271 13,18.5 L13,17.5 C13,16.6715729 13.6715729,16 14.5,16 Z'
                                        fill='currentColor'
                                      />
                                      <path
                                        d='M5.5,10 L9.5,10 C10.3284271,10 11,10.6715729 11,11.5 L11,18.5 C11,19.3284271 10.3284271,20 9.5,20 L5.5,20 C4.67157288,20 4,19.3284271 4,18.5 L4,11.5 C4,10.6715729 4.67157288,10 5.5,10 Z M14.5,4 L18.5,4 C19.3284271,4 20,4.67157288 20,5.5 L20,12.5 C20,13.3284271 19.3284271,14 18.5,14 L14.5,14 C13.6715729,14 13,13.3284271 13,12.5 L13,5.5 C13,4.67157288 13.6715729,4 14.5,4 Z'
                                        fill='currentColor'
                                        opacity='0.3'
                                      />
                                    </g>
                                  </svg>
                                  {/*end::Svg Icon*/}
                                </span>
                                <select
                                  className='form-select border-0'
                                  data-control='select2'
                                  data-placeholder='Branch'
                                  data-hide-search='true'
                                >
                                  <option>Branch</option>
                                  <option value={1}>Option 1</option>
                                  <option value={2}>Option 2</option>
                                  <option value={3}>Option 3</option>
                                  <option value={4}>Option 4</option>
                                  <option value={5}>Option 5</option>
                                </select>
                              </div>
                              {/*end::Input*/}
                              <button
                                type='submit'
                                className='btn btn-dark font-weight-bold btn-hover-light-primary rounded-border mt-3 mt-sm-0 px-7'
                              >
                                Search
                              </button>
                            </form>
                            {/*end::Form*/}
                          </div>
                        </div>
                        {/*end::Search Bar*/}
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-12'>
                        <div className='table-responsive'>
                          <table
                            id='kt_datatable_example_1'
                            className='table nav d-table table-rounded table-striped table-hover border gy-3 gx-7'
                          >
                            <thead>
                              <tr className='fw-bold fs-6 text-gray-800 border-bottom border-gray-200'>
                                <th>Client A/C</th>
                                <th>Name</th>
                                <th>Owner</th>
                                <th className='text-end'>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>M1200</td>
                                <td>MD. Mubin</td>
                                <td>ACKIJD6525</td>
                                <td className='text-end'>
                                  <MyTooltip id='list-edit' content='Edit'>
                                    <a
                                      href='#'
                                      className='btn btn-outline-primary btn-sm'
                                      onClick={(e) => setShow_2(true)}
                                    >
                                      <span className='svg-icon'>
                                        <svg
                                          xmlns='http://www.w3.org/2000/svg'
                                          xmlnsXlink='http://www.w3.org/1999/xlink'
                                          width='24px'
                                          height='24px'
                                          viewBox='0 0 24 24'
                                          version='1.1'
                                        >
                                          <g
                                            stroke='none'
                                            strokeWidth={1}
                                            fill='none'
                                            fillRule='evenodd'
                                          >
                                            <rect x={0} y={0} width={24} height={24} />
                                            <path
                                              d='M8,17.9148182 L8,5.96685884 C8,5.56391781 8.16211443,5.17792052 8.44982609,4.89581508 L10.965708,2.42895648 C11.5426798,1.86322723 12.4640974,1.85620921 13.0496196,2.41308426 L15.5337377,4.77566479 C15.8314604,5.0588212 16,5.45170806 16,5.86258077 L16,17.9148182 C16,18.7432453 15.3284271,19.4148182 14.5,19.4148182 L9.5,19.4148182 C8.67157288,19.4148182 8,18.7432453 8,17.9148182 Z'
                                              fill='currentColor'
                                              fillRule='nonzero'
                                              transform='translate(12.000000, 10.707409) rotate(-135.000000) translate(-12.000000, -10.707409) '
                                            />
                                            <rect
                                              fill='currentColor'
                                              opacity='0.3'
                                              x={5}
                                              y={20}
                                              width={15}
                                              height={2}
                                              rx={1}
                                            />
                                          </g>
                                        </svg>
                                      </span>
                                    </a>
                                  </MyTooltip>
                                </td>
                              </tr>
                              <tr data-bs-toggle='tab'>
                                <td>M1200</td>
                                <td>MD. Mubin</td>
                                <td>ACKIJD6525</td>
                                <td className='text-end'>
                                  <MyTooltip id='list-edit-3' content='Edit'>
                                    <a
                                      href='#'
                                      className='btn btn-outline-primary-primary btn-sm'
                                      onClick={(e) => setShow_2(true)}
                                    >
                                      <span className='svg-icon'>
                                        <svg
                                          xmlns='http://www.w3.org/2000/svg'
                                          xmlnsXlink='http://www.w3.org/1999/xlink'
                                          width='24px'
                                          height='24px'
                                          viewBox='0 0 24 24'
                                          version='1.1'
                                        >
                                          <g
                                            stroke='none'
                                            strokeWidth={1}
                                            fill='none'
                                            fillRule='evenodd'
                                          >
                                            <rect x={0} y={0} width={24} height={24} />
                                            <path
                                              d='M8,17.9148182 L8,5.96685884 C8,5.56391781 8.16211443,5.17792052 8.44982609,4.89581508 L10.965708,2.42895648 C11.5426798,1.86322723 12.4640974,1.85620921 13.0496196,2.41308426 L15.5337377,4.77566479 C15.8314604,5.0588212 16,5.45170806 16,5.86258077 L16,17.9148182 C16,18.7432453 15.3284271,19.4148182 14.5,19.4148182 L9.5,19.4148182 C8.67157288,19.4148182 8,18.7432453 8,17.9148182 Z'
                                              fill='currentColor'
                                              fillRule='nonzero'
                                              transform='translate(12.000000, 10.707409) rotate(-135.000000) translate(-12.000000, -10.707409) '
                                            />
                                            <rect
                                              fill='currentColor'
                                              opacity='0.3'
                                              x={5}
                                              y={20}
                                              width={15}
                                              height={2}
                                              rx={1}
                                            />
                                          </g>
                                        </svg>
                                      </span>
                                    </a>
                                  </MyTooltip>
                                </td>
                              </tr>
                              <tr data-bs-toggle='tab'>
                                <td>M1200</td>
                                <td>MD. Mubin</td>
                                <td>ACKIJD6525</td>
                                <td className='text-end'>
                                  <MyTooltip id='list-edit-2' content='Edit'>
                                    <a
                                      href='#'
                                      className='btn btn-outline-primary btn-sm'
                                      onClick={(e) => setShow_2(true)}
                                    >
                                      <span className='svg-icon'>
                                        <svg
                                          xmlns='http://www.w3.org/2000/svg'
                                          xmlnsXlink='http://www.w3.org/1999/xlink'
                                          width='24px'
                                          height='24px'
                                          viewBox='0 0 24 24'
                                          version='1.1'
                                        >
                                          <g
                                            stroke='none'
                                            strokeWidth={1}
                                            fill='none'
                                            fillRule='evenodd'
                                          >
                                            <rect x={0} y={0} width={24} height={24} />
                                            <path
                                              d='M8,17.9148182 L8,5.96685884 C8,5.56391781 8.16211443,5.17792052 8.44982609,4.89581508 L10.965708,2.42895648 C11.5426798,1.86322723 12.4640974,1.85620921 13.0496196,2.41308426 L15.5337377,4.77566479 C15.8314604,5.0588212 16,5.45170806 16,5.86258077 L16,17.9148182 C16,18.7432453 15.3284271,19.4148182 14.5,19.4148182 L9.5,19.4148182 C8.67157288,19.4148182 8,18.7432453 8,17.9148182 Z'
                                              fill='currentColor'
                                              fillRule='nonzero'
                                              transform='translate(12.000000, 10.707409) rotate(-135.000000) translate(-12.000000, -10.707409) '
                                            />
                                            <rect
                                              fill='currentColor'
                                              opacity='0.3'
                                              x={5}
                                              y={20}
                                              width={15}
                                              height={2}
                                              rx={1}
                                            />
                                          </g>
                                        </svg>
                                      </span>
                                    </a>
                                  </MyTooltip>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Modal show={show_2} onHide={handleClose_2} size='lg' backdrop='static'>
                  <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div>
                      <ul className='nav nav-tabs nav-line-tabs nav-line-tabs-2x mb-7 fs-6'>
                        <li className='nav-item'>
                          <a
                            href='#'
                            className={
                              tabauthorization
                                ? 'nav-link text-dark fw-bolder active'
                                : 'nav-link text-dark fw-bolder'
                            }
                            onClick={(e) => {
                              settabauthorization(true)
                              settablimits(false)
                              settabconnection(false)
                              settabidentity(false)
                            }}
                          >
                            Authorization
                          </a>
                        </li>
                        <li className='nav-item'>
                          <a
                            href='#'
                            className={
                              tablimits
                                ? 'nav-link text-dark fw-bolder active'
                                : 'nav-link text-dark fw-bolder'
                            }
                            onClick={(e) => {
                              settabauthorization(false)
                              settablimits(true)
                              settabconnection(false)
                              settabidentity(false)
                            }}
                          >
                            Limits
                          </a>
                        </li>
                        <li className='nav-item'>
                          <a
                            href='#'
                            className={
                              tabconnection
                                ? 'nav-link text-dark fw-bolder active'
                                : 'nav-link text-dark fw-bolder'
                            }
                            onClick={(e) => {
                              settabauthorization(false)
                              settablimits(false)
                              settabconnection(true)
                              settabidentity(false)
                            }}
                          >
                            Connection
                          </a>
                        </li>
                        <li className='nav-item'>
                          <a
                            href='#'
                            className={
                              tabidentity
                                ? 'nav-link text-dark fw-bolder active'
                                : 'nav-link text-dark fw-bolder'
                            }
                            onClick={(e) => {
                              settabauthorization(false)
                              settablimits(false)
                              settabconnection(false)
                              settabidentity(true)
                            }}
                          >
                            Identity
                          </a>
                        </li>
                      </ul>
                      <div className='tab-content' id='myTabContent'>
                        {tabauthorization && (
                          <div className='tab-pane fade show active' role='tabpanel'>
                            <h4 className='mb-3'>Market Segments</h4>
                            <div className=' table-responsive'>
                              <table className='table table-rounded table-striped border g-3 mb-8'>
                                <thead>
                                  <tr className='fw-bold fs-6 text-gray-800'>
                                    <th className='min-w-50px' />
                                    <th className='min-w-100px'>Public</th>
                                    <th className='min-w-100px'>Spot</th>
                                    <th className='min-w-100px'>Debt</th>
                                    <th className='min-w-100px'>Buy-in</th>
                                    <th className='min-w-100px'>Block</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Main (xdse)</td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>ATB (odse)</td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>SC (sdse)</td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <h4 className='mb-3'>Orders</h4>
                            <div className=' table-responsive'>
                              <table className='table table-rounded table-striped border g-3 mb-8'>
                                <thead>
                                  <tr className='fw-bold fs-6 text-gray-800'>
                                    <th className='min-w-50px' />
                                    <th className='min-w-50px'>Limit</th>
                                    <th className='min-w-100px'>Market</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Main (xdse)</td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>ATB (odse)</td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>SC (sdse)</td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <h4 className='mb-3'>Transactions</h4>
                            <div className=' table-responsive'>
                              <table className='table table-rounded table-striped border g-3 mb-0'>
                                <thead>
                                  <tr className='fw-bold fs-6 text-gray-800'>
                                    <th className='min-w-50px' />
                                    <th className='min-w-50px'>1-Firm</th>
                                    <th className='min-w-100px'>2-Firm</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Main (xdse)</td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>ATB (odse)</td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>SC (sdse)</td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                    <td>
                                      <div className='form-check form-check-custom form-check-sm'>
                                        <input className='form-check-input' type='checkbox' />
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {tablimits && (
                          <div
                            className={
                              tablimits ? 'tab-pane fade show active' : 'tab-pane fade show active'
                            }
                            role='tabpanel'
                          >
                            <h4 className='mb-3'>Limits</h4>
                          </div>
                        )}

                        {tabconnection && (
                          <div
                            className={
                              tabconnection
                                ? 'tab-pane fade show active'
                                : 'tab-pane fade show active'
                            }
                            role='tabpanel'
                          >
                            <h4 className='mb-3'>Connection</h4>
                          </div>
                        )}

                        {tabidentity && (
                          <div
                            className={
                              tabidentity
                                ? 'tab-pane fade show active'
                                : 'tab-pane fade show active'
                            }
                            role='tabpanel'
                          >
                            <h4 className='mb-3'>Identity</h4>
                          </div>
                        )}
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose_2}>
                      Close
                    </Button>
                    <Button variant='primary' onClick={handleClose_2}>
                      Save Changes
                    </Button>
                  </Modal.Footer>
                </Modal>
              </>
            )}
            {tab3 && (
              <>
                <p className='text-center text-success'>MD. Mubin</p>
              </>
            )}

            {tab4 && (
              <>
                <p className='text-center text-success'>MD. Mubin</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
