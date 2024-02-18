import initLayout from '#tws/constants/init-layout'
import {isEqual} from 'lodash'
import {useCallback, useEffect, useState} from 'react'
import type {Layout} from 'react-grid-layout/lib/utils'
import {useDispatch, useSelector} from 'react-redux'
import {LayoutInterface} from '../common/types/redux'
import type {RootState} from '../redux'
import {
  addNewLayout,
  updateHaveLocalChange,
  updateIsEnableEdit,
  updateLayoutState,
  updateSelectedLayout,
} from '../redux/slices/layouts'
import {handleChangeTheme} from '../redux/slices/userData'

interface Props {
  pageName: string
  selectedLayout?: string
}

const useGridLayout = ({pageName, selectedLayout = 'default'}: Props) => {
  const dispatch = useDispatch()
  const layouts = useSelector((state: RootState) => state.layouts)

  const [isLayoutUpdate, setIsLayoutUpdate] = useState(false)

  // const selectedPageLayout = useMemo(
  //   () =>
  //     layouts.data
  //       .find(
  //         (layout) => layout.layoutName.toLocaleLowerCase() === selectedLayout.toLocaleLowerCase()
  //       )
  //       ?.pages.find((page) => page.name === pageName)?.layout ?? ({} as Layout),
  //   [layouts.data, pageName, selectedLayout]
  // )

  const selectedPageLayout = (layoutData) => {
    return (
      layoutData
        .find(
          (layout) => layout.layoutName.toLocaleLowerCase() === selectedLayout.toLocaleLowerCase()
        )
        ?.pages.find((page) => page.name.toLocaleLowerCase() === pageName.toLocaleLowerCase())
        ?.layout ?? ({} as Layout)
    )
  }

  // States

  const reCallLayout = useCallback(
    (layoutData) => {
      const _layoutString = localStorage.getItem('_localLayout')
      if (_layoutString) {
        const _layoutObj = JSON.parse(_layoutString)
        dispatch(
          updateSelectedLayout(
            _layoutObj.pages.find(
              (page) => page.name.toLocaleLowerCase() === pageName.toLocaleLowerCase()
            )?.layout
          )
        )
        dispatch(updateHaveLocalChange(true))
      } else {
        dispatch(updateSelectedLayout(selectedPageLayout(layoutData)))
        dispatch(updateHaveLocalChange(false))
      }
    },
    [pageName]
  )

  // add theme edit mode on off

  const layoutEdit = useCallback(() => {
    if (!layouts.selected?.[layouts.layoutState.currentBreakpoint]) {
      return
    }
    const _edit = !!layouts.selected[layouts.layoutState.currentBreakpoint].filter(
      (item) => item.static
    ).length
    dispatch(updateIsEnableEdit(!_edit))
  }, [layouts.selected, layouts.layoutState.currentBreakpoint])

  useEffect(() => {
    layoutEdit()
  }, [layouts.selected, layoutEdit])

  //
  useEffect(() => {
    reCallLayout(layouts.data)
  }, [layouts.data])

  /**
   * On Layout Change
   * @param currentLayout
   */
  const onLayoutChange = (currentLayout: Layout) => {
    let result: boolean[] = []

    currentLayout.forEach((layout) => {
      const _reduxItem = selectedPageLayout?.[layouts.layoutState.currentBreakpoint]?.find(
        (item) => item.i === layout.i
      )
      const isSame = isEqual(layout, _reduxItem)
      result.push(isSame)

      // if (!isSame) console.log({c: layout, r: _reduxItem})
    })

    if (result.includes(false)) {
      const _localLayout = localStorage.getItem('_localLayout')

      if (_localLayout) {
        const _localLayoutObj = JSON.parse(_localLayout)

        const _pageIndex = _localLayoutObj.pages.findIndex(
          (page) => page.name.toLocaleLowerCase() === pageName.toLocaleLowerCase()
        )

        const l = currentLayout.map((scl) => {
          const fl = initLayout.lg.find((i) => i.i === scl.i)

          if (fl) {
            return {...fl, ...scl}
          }
          return scl
        })

        _localLayoutObj.pages[_pageIndex].layout = {
          ..._localLayoutObj.pages[_pageIndex].layout,
          [layouts.layoutState.currentBreakpoint]: l,
        }

        localStorage.setItem('_localLayout', JSON.stringify(_localLayoutObj))
      } else {
        const _currentLayout = JSON.parse(
          JSON.stringify(
            layouts.data.find(
              (layout) =>
                layout.layoutName.toLocaleLowerCase() === selectedLayout.toLocaleLowerCase()
            )
          )
        )

        // if (!_currentLayout) return null
        // const _pageIndex = _currentLayout?.pages.findIndex((page) => page.name === pageName)

        // if (_pageIndex === undefined || _pageIndex < 0) return null

        // _currentLayout.pages[_pageIndex].layout = {
        //   ..._currentLayout.pages[_pageIndex].layout,
        //   [layouts.layoutState.currentBreakpoint]: currentLayout,
        // }

        localStorage.setItem('_localLayout', JSON.stringify(_currentLayout))
      }
      setIsLayoutUpdate((prevState) => !prevState)
      dispatch(updateHaveLocalChange(true))
    } else {
      localStorage.removeItem('_localLayout')
      setIsLayoutUpdate((prevState) => !prevState)
    }
  }

  const onDrop: (layout: Layout, item: any, e: Event) => void = (elemParams) => {
    alert(`Element parameters: ${JSON.stringify(elemParams)}`)
  }

  // Edit mode on dashboard layout
  const _staticToggle = (layout, isFromMinimize = false) => {
    console.log('_staticToggle')

    const layoutObj = JSON.parse(JSON.stringify(layout))
    const pageIndex = layoutObj.pages.findIndex(
      (page) => page.name.toLocaleLowerCase() === pageName.toLocaleLowerCase()
    )

    if (pageIndex < 0) return

    const storeLayout = layoutObj.pages
      .find((page) => page.name.toLocaleLowerCase() === pageName.toLocaleLowerCase())
      ?.layout[layouts.layoutState.currentBreakpoint].map((item) => ({
        ...item,
        static: isFromMinimize ? false : !item.static,
      }))
    layoutObj.pages[pageIndex].layout[layouts.layoutState.currentBreakpoint] = storeLayout

    localStorage.setItem('_localLayout', JSON.stringify(layoutObj))

    dispatch(
      updateSelectedLayout(
        layoutObj.pages.find(
          (page) => page.name.toLocaleLowerCase() === pageName.toLocaleLowerCase()
        )?.layout
      )
    )
    setIsLayoutUpdate((prevState) => !prevState)
    dispatch(updateHaveLocalChange(true))
  }

  /**
   * Handle Minimize Section
   * @param {name, height}
   */
  const handleMinimize = ({name, height}: {name: string; height: number}) => {
    const _localLayout = localStorage.getItem('_localLayout')
    let mainLayout: LayoutInterface

    if (_localLayout) {
      mainLayout = JSON.parse(_localLayout)
    } else {
      mainLayout = JSON.parse(
        JSON.stringify(
          layouts.data.find(
            (layout) => layout.layoutName.toLocaleLowerCase() === selectedLayout.toLocaleLowerCase()
          )
        )
      )
    }

    // Find page and section index
    const pageIndex = mainLayout.pages.findIndex(
      (page) => page.name.toLocaleLowerCase() === pageName.toLocaleLowerCase()
    )
    const sectionIndex = mainLayout.pages[pageIndex].layout[
      layouts.layoutState.currentBreakpoint
    ].findIndex((section) => section.i === name)

    // Check the minimize section available or not
    const isMinimizeSectionAvailable =
      mainLayout.pages?.[pageIndex]?.minimize?.[name]?.[layouts.layoutState.currentBreakpoint]

    if (isMinimizeSectionAvailable) {
      const minimizedObj = {
        ...mainLayout.pages?.[pageIndex]?.minimize?.[name][layouts.layoutState.currentBreakpoint],
      }
      // delete previous
      delete mainLayout.pages?.[pageIndex]?.minimize?.[name]

      // Modify layout
      mainLayout.pages[pageIndex].layout[layouts.layoutState.currentBreakpoint][sectionIndex].h =
        minimizedObj.h
    } else {
      // Update Minimize Section
      mainLayout.pages[pageIndex].minimize = {
        ...mainLayout.pages[pageIndex].minimize,
        [name]: {
          [layouts.layoutState.currentBreakpoint]:
            mainLayout.pages[pageIndex].layout[layouts.layoutState.currentBreakpoint][sectionIndex],
        },
      }

      // Modify layout
      mainLayout.pages[pageIndex].layout[layouts.layoutState.currentBreakpoint][sectionIndex] = {
        ...mainLayout.pages[pageIndex].layout[layouts.layoutState.currentBreakpoint][sectionIndex],
        h: height,
      }
    }

    _staticToggle(mainLayout, true)

    // localStorage.setItem('_localLayout', JSON.stringify(mainLayout))
    // setLayout(mainLayout.pages[pageIndex].layout)
    // setIsLayoutUpdate((prevState) => !prevState)
    // setHaveLocalChanges(true)
  }

  const handleEnableEditMood = () => {
    const _localLayout = localStorage.getItem('_localLayout')

    if (_localLayout) {
      const localLayoutObj: LayoutInterface = JSON.parse(_localLayout)
      _staticToggle(localLayoutObj)
    } else {
      _staticToggle(
        layouts.data.find(
          (layout) => layout.layoutName.toLocaleLowerCase() === selectedLayout.toLocaleLowerCase()
        )
      )
    }
  }

  const onBreakpointChange: (Breakpoint) => void = (breakpoint) => {
    dispatch(updateLayoutState({currentBreakpoint: breakpoint}))
  }

  const handleDefault = () => {
    localStorage.removeItem('_localLayout')
    setIsLayoutUpdate((prevState) => !prevState)
    dispatch(handleChangeTheme('default'))
  }

  const handleSaveLayout = (data) => {
    dispatch(addNewLayout(data))
  }

  return {
    handleEnableEditMood,
    onBreakpointChange,
    handleSaveLayout,
    onLayoutChange,
    handleMinimize,
    handleDefault,
    onDrop,
  }
}

export default useGridLayout
