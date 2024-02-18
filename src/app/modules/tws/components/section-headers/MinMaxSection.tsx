import {RootState} from '#store/index'
import React, {useEffect, useState} from 'react'
import {FiMaximize2, FiMinimize2} from 'react-icons/fi'
import {useSelector} from 'react-redux'

const MinMaxSection = ({handleClick, layout}) => {
  const {layouts, userData} = useSelector((state: RootState) => state)
  const [minimizedData, setMinimizedData] = useState<any>()
  const [refetchData, setRefetchData] = useState<boolean>(false)
  useEffect(() => {
    const _localLayout = localStorage.getItem('_localLayout')
    if (_localLayout) {
      const _localLayoutObj = JSON.parse(_localLayout)
      setMinimizedData(
        _localLayoutObj.layoutName === userData.settings.selectedLayout
          ? _localLayoutObj.pages.find((page) => page.name === 'dashboard')?.minimize
          : null
      )
    } else {
      setMinimizedData(
        layouts.data
          .find((layout) => layout.layoutName === userData.settings.selectedLayout)
          ?.pages.find((page) => page.name === 'dashboard')?.minimize
      )
    }
  }, [refetchData])

  return (
    <button
      onClick={() => {
        setRefetchData((prevState) => !prevState)
        handleClick()
      }}
      className='btn custom-btn tw-bg-gradient-to-r tw-from-blue-400 tw-to-emerald-400 dark:tw-bg-gradient-to-r dark:tw-from-purple-900 dark:tw-to-purple-700'
    >
      {minimizedData?.[layout.i]?.[layouts.layoutState.currentBreakpoint] ? (
        <FiMaximize2 className='text-white fs-3' title='Maximize' />
      ) : (
        <FiMinimize2 className='text-white fs-3' title='Minimize' />
      )}
      
    </button>
  )
}

export default MinMaxSection
