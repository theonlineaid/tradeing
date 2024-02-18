import {IndexDataStruct, IndexDataType} from '#common/types/index-data'
import {IndexDataContext} from '#context/indexContext'
import thousandsSeparators from '#helpers/thousandsSeparators'
import {RootState} from '#store/index'
import {useContext, useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import Select from 'react-select'

const INITIAL_STATE = {
  date: '',
  time: '',
  group: '',
  security_name: '',
  value: 2112.23234,
  stream_id: 0,
}

const IndexWarper = (props) => {
  const {indexData} = useContext(IndexDataContext) as IndexDataType

  const {linkedTable, global, headerData} = useSelector((state: RootState) => state)
  const [selectedOption, setSelectedOption] = useState<any>(null)
  const [indexDataForFilter, setIndexDataForFilter] = useState<IndexDataStruct>(INITIAL_STATE)
  const [options, setOptions] = useState<any | []>([])

  const targetHeight = 25

  const styles = {
    control: (base: any) => ({
      ...base,
      minHeight: 'initial',
      // minWidth: '150px',
      width: '150px',
      textAlign: 'left',
      background: global?.mode === 'dark' ? 'rgb(20 28 38 / 1) !important;' : '',
    }),
    valueContainer: (base: any) => ({
      ...base,
      height: `${targetHeight - 1 - 1}px`,
      padding: '0 8px',
      borderRadius: '5px',
      color: global?.mode === 'dark' ? '#FFF !important;' : '',
      background: global?.mode === 'dark' ? 'rgb(20 28 38 / 1) !important;' : '',
    }),
    singleValue: (base: any) => ({
      ...base,
      color: global?.mode === 'dark' ? '#5e6278 !important;' : '',
    }),
    input: (base: any) => ({
      ...base,
      color: global?.mode === 'dark' ? '#5e6278 !important;' : '',
    }),
    indicatorSeparator: (base: any) => ({
      ...base,
      color: global?.mode === 'dark' ? '#5e6278 !important;' : '',
    }),
    menu: (base: any) => ({
      ...base,
      background: global?.mode === 'dark' ? 'rgb(20 28 38 / 1) !important;' : '',
      color: global?.mode === 'dark' ? '#5e6278 !important;' : '',
    }),
    clearIndicator: (base: any) => ({
      ...base,
      fontSize: '10px',
      padding: `${(targetHeight - 20 - 1 - 1) / 2}px`,
      background: global?.mode === 'dark' ? 'rgb(20 28 38 / 1) !important;' : '',
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      padding: `${(targetHeight - 20 - 1 - 1) / 2}px`,
      background: global?.mode === 'dark' ? 'rgb(20 28 38 / 1) !important;' : '',
    }),
  }

  const findIndexData = () => {
    if (selectedOption) {
      const data: IndexDataStruct | any = indexData.find(
        (itm) => itm.security_name === selectedOption.value
      )

      // Set the found data in the component's state using the setIndexDataForFilter function
      setIndexDataForFilter(data)
    }
  }

  useEffect(() => {
    const options = indexData?.map((item) => {
      return {
        label: item?.security_name,
        value: item?.security_name,
      }
    })

    if (options) {
      setSelectedOption(options[0])
    }

    setOptions(options)
  }, [indexData])

  useEffect(() => {
    findIndexData()
  }, [selectedOption])

  return (
    <div className='container-fluid px-4 mt-2'>
      <div className='tw-flex tw-gap-5 lg:tw-gap-10 2xl:tw-gap-20 tw-items-center'>
        <div className='tw-flex tw-gap-5 tw-items-center'>
          <div className='tw-w-[150px]'>
            <Select
              className='basic-single'
              classNamePrefix='select'
              styles={styles}
              // isClearable={true}
              isSearchable={true}
              // name='Index'
              // placeholder='Index'
              // defaultValue={selectedOption}
              onChange={setSelectedOption}
              options={options}
              value={selectedOption}
            />
          </div>
          <div className='tw-flex tw-gap-2 tw-items-center'>
            <div className='tw-flex tw-gap-1 tw-items-center tw-whitespace-nowrap'>
              <span className='index-label-text'>Last:</span>
              <p className='tw-px-1 tw-text-sm lg:tw-text-base 2xl:tw-text-lg tw-text-green-500 dark:tw-font-bold'>
                {thousandsSeparators(indexDataForFilter.value)}
              </p>
            </div>
            <div className='tw-flex tw-gap-1 tw-items-center tw-whitespace-nowrap'>
              <span className='index-label-text'>Net (Net%):</span>
              <p className='tw-px-1 tw-text-sm lg:tw-text-base 2xl:tw-text-lg tw-text-green-500 dark:tw-font-bold'>
                0.232(+0.2%)
              </p>
            </div>
          </div>
        </div>
        <div className='tw-grow tw-flex tw-gap-2 tw-items-center tw-justify-between tw-overflow-x-scroll index-scroll'>
          <div className='tw-flex tw-gap-1 tw-items-center tw-whitespace-nowrap'>
            <span className='index-label-text'>Main Market 85.12M</span>
          </div>
          <div className='tw-flex tw-gap-1 tw-items-center tw-whitespace-nowrap'>
            <span className='index-label-text'>Value: 412.32M</span>
          </div>
          <div className='tw-flex tw-gap-1 tw-items-center tw-whitespace-nowrap'>
            <span className='index-label-text'>Treads: 234,32</span>
          </div>
          <div className='tw-flex tw-gap-1 tw-items-center tw-whitespace-nowrap'>
            <span className='index-label-text'>Up:</span>
            <p className='tw-px-1 tw-text-green-500 dark:tw-font-bold'>125</p>
          </div>
          <div className='tw-flex tw-gap-1 tw-items-center tw-whitespace-nowrap'>
            <span className='index-label-text'>Down:</span>
            <p className='tw-px-1 tw-text-red-500 dark:tw-font-bold'>73</p>
          </div>
          <div className='tw-flex tw-gap-1 tw-items-center tw-whitespace-nowrap'>
            <span className='index-label-text'>Unchanged: 164</span>
          </div>
          <div className='tw-flex tw-gap-1 tw-items-center tw-whitespace-nowrap'>
            <span className='index-label-text'>Not Change: 686</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IndexWarper
