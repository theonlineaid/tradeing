import {RootState} from '#store/index'
import {ControlledMenu, MenuItem, SubMenu, useMenuState} from '@szhsin/react-menu'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import {Modal} from 'react-bootstrap'
import Dropdown from 'react-bootstrap/Dropdown'
import {BiExport} from 'react-icons/bi'
import {FiMaximize2, FiMinimize2} from 'react-icons/fi'
import {useDispatch, useSelector} from 'react-redux'
import {LayoutComponentInterface} from '#common/types/tws'
import SvgIcon from './../../../common/components/svg-icons/index'
interface Props {
  data: LayoutComponentInterface
  layout: any
  handleMinimizeSection: ({height, name}: {height: number; name: string}) => void
}

const SectionItem: React.FC<React.PropsWithChildren<Props>> = ({
  data,
  layout,
  handleMinimizeSection,
}) => {
  const {layouts, userData} = useSelector((state: RootState) => state)

  // States
  const [menuProps, toggleMenu] = useMenuState()
  const [anchorPoint, setAnchorPoint] = useState({x: 0, y: 0})
  const [minimizedData, setMinimizedData] = useState<any>()
  const [refetchData, setRefetchData] = useState<boolean>(false)
  const [selectedTab, setSelectedTab] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)
  // Refs
  const gridRef: any = useRef()

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

  const handleClick = () => {
    setRefetchData((prevState) => !prevState)
    handleMinimizeSection({
      name: layout?.i,
      height: 3.75,
    })
  }
  // panel export btn
  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv()
  }, [])

  // search filter
  const onFilterTextBoxChanged = useCallback(() => {
    var gridApi: any = gridRef.current
    var searchField: any = document.getElementById('filter-text-box')
    gridApi.api.setQuickFilter(searchField.value)
  }, [])

  useEffect(() => {
    if (!data) return
    if (data.tabs.length && !selectedTab) {
      setSelectedTab(data.tabs[0].id)
    }
  }, [data])

  // return (
  //   <div className='card rounded-1 h-100  '>
  //     {!minimizedData?.[layout.i]?.[layouts.layoutState.currentBreakpoint] && (
  //       <div className='card-body p-0'>
  //         {data?.component ? (
  //           <data.component />
  //         ) : (
  //           data.tabs.map((tab) => {
  //             if (tab.id === selectedTab) {
  //               return tab.component
  //             } else {
  //               return null
  //             }
  //           })
  //         )}
  //       </div>
  //     )}
  //   </div>
  // )

  return null
}

export default SectionItem
