/* eslint-disable jsx-a11y/anchor-is-valid */
import {setUserALlThemes} from '#store/slices/themeSlice'
import clsx from 'clsx'
import cogoToast from 'cogo-toast'
import {FC, PropsWithChildren, useEffect} from 'react'
import {FiCheck, FiRefreshCcw, FiRotateCw, FiSave, FiTrash2} from 'react-icons/fi'
import {useDispatch, useSelector} from 'react-redux'
import {useLocation} from 'react-router-dom'
import Switch from 'react-switch'
import useGridLayout from '../../../../app/hooks/use-grid-layout'
import {
  userTheme,
  userThemeCreate,
  userThemeDelete,
  userThemeUpdate,
} from '../../../../app/modules/auth/core/_requests'
import {RootState} from '../../../../app/redux'
import {
  updateHaveLocalChange,
  updateLayoutDataLocal,
  updateSelectedLayout,
} from '../../../../app/redux/slices/layouts'
import {handleChangeTheme} from '../../../../app/redux/slices/userData'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'

export const Theme: FC<PropsWithChildren> = () => {
  const dispatch = useDispatch()
  const {pathname} = useLocation()

  const {handleSaveLayout, handleEnableEditMood} = useGridLayout({
    pageName: pathname.split('/')?.[1],
  })

  const {layouts, global, theme} = useSelector((state: RootState) => state)
  const user = useSelector((state: RootState) => state.userData)
  const selectedTheme = useSelector((state: RootState) => state.userData.settings.selectedLayout)

  const reloadIfNotSelected = () => {
    if (Object.keys(layouts.selected).length === 0) {
      window.location.reload()
    }
  }

  const handleReset = async (layoutName: string) => {
    localStorage.removeItem('_localLayout')
    dispatch(
      updateSelectedLayout(
        layouts.data
          .find((layout) => layout.layoutName === layoutName)
          ?.pages.find((page) => page.name.toLocaleLowerCase() === pathname.split('/')?.[1])?.layout
      )
    )
    dispatch(updateHaveLocalChange(false))

    reloadIfNotSelected()
  }

  const onToggle = () => {
    handleEnableEditMood()
  }

  const handleApplyTheme = (name: string) => {
    // console.log({
    //   name,
    //   data: layouts.data
    //     .find((layout) => layout.layoutName === name)
    //     ?.pages.find((page) => page.name === pathname.split('/')?.[1])?.layout,
    // })

    dispatch(handleChangeTheme(name))
    const _selected = layouts.data
      .find((layout) => layout.layoutName === name)
      ?.pages.find((page) => page.name === pathname.split('/')?.[1])?.layout

    if (_selected) {
      dispatch(updateSelectedLayout(_selected))
    } else {
      cogoToast.error('Theme not found!')
    }
    // localStorage.removeItem('_localLayout')

    // reloadIfNotSelected()
  }

  const onLayoutSave = async () => {
    const _layoutString = localStorage.getItem('_localLayout')
    if (layouts.data.length < 6) {
      let num = layouts.data.length
      let NEW_LAYOUT_NAME = `theme${num}`

      let loop = true

      while (loop) {
        NEW_LAYOUT_NAME = `theme${num}`
        if (layouts.data.findIndex((item) => item.layoutName === NEW_LAYOUT_NAME) === -1) {
          loop = false
        }
        num += 1
      }

      // console.log({
      //   data: layouts.data,
      //   length: layouts.data.length,
      //   NEW_LAYOUT_NAME,
      // })

      if (_layoutString) {
        const _layoutObj = JSON.parse(_layoutString)
        _layoutObj.layoutName = NEW_LAYOUT_NAME

        if (!user.profile?.id) {
          cogoToast.error('User not loggedIn', {position: 'top-right'})
          return
        }

        const data = {
          user: user.profile?.id,
          layout: _layoutObj,
          theme_name: NEW_LAYOUT_NAME,
        }

        const response = await userThemeCreate(data)

        if ((response.data?.data?.status === 200, 201)) {
          cogoToast.success('Save new layout!')
          localStorage.removeItem('_localLayout')

          handleSaveLayout(_layoutObj)

          dispatch(
            updateSelectedLayout(
              _layoutObj.pages.find((page) => page.name === pathname.split('/')?.[1])?.layout
            )
          )
          dispatch(handleChangeTheme(NEW_LAYOUT_NAME))
        } else {
          cogoToast.error('Something went wrong!')
        }
      }
    } else {
      cogoToast.error("You can't create more then 5 themes", {position: 'top-right'})
    }
  }

  const handleDeleteTheme = async (layoutName: string) => {
    const deleteResult = await userThemeDelete(layoutName)

    if (
      deleteResult?.data?.msg === 'Theme delete successfully !' ||
      deleteResult?.data?.status === 200
    ) {
      dispatch(
        updateLayoutDataLocal(layouts.data.filter((layout) => layout.layoutName !== layoutName))
      )
      cogoToast.success('Theme successfully deleted!', {position: 'top-right'})

      reloadIfNotSelected()
    }
  }

  const handleUpdateLayout = async (layoutName: string) => {
    const _localLayout = localStorage.getItem('_localLayout')
    if (_localLayout) {
      const _localLayoutObj = JSON.parse(_localLayout)

      if (_localLayoutObj.layoutName !== layoutName)
        cogoToast.error('Local changes is not matched with your selected layout!', {
          position: 'top-right',
        })

      if (!user.profile?.id) {
        cogoToast.error('User not loggedIn', {position: 'top-right'})
        return
      }
      const data = {
        user: user.profile?.id,
        layout: _localLayoutObj,
        theme_name: _localLayoutObj.layoutName,
      }
      const response = await userThemeUpdate(layoutName, data)

      if ((response.data?.data?.status === 200, 201)) {
        cogoToast.success('Update layout successfully!')
        localStorage.removeItem('_localLayout')
      } else {
        cogoToast.error('Error in updating theme!')
      }
    }
  }

  // get all user theme and store it to redux storage
  useEffect(() => {
    ;(async () => {
      const {data} = await userTheme()

      // dispatch to redux
      dispatch(setUserALlThemes(data?.data))
    })()
  }, [])

  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px'
      data-kt-menu='true'
    >
      <div
        className='tw-flex flex-column bgi-no-repeat rounded-top'
        style={{
          backgroundImage: `url('${toAbsoluteUrl('/media/logos/pattern-1.jpg')}')`,
          backgroundPosition: 'center',
          backgroundColor: '#3954BB',
        }}
      >
        <div className='tw-flex tw-items-center tw-justify-between px-4 my-6'>
          <div>
            <h4 className='tw-text-slate-100 tw-font-bold '>Themes</h4>
            <span className='tw-text-slate-300 tw-text-md tw-ps-3'>{`${layouts.data.length} ${
              layouts.data.length > 1 ? 'themes' : 'theme'
            } available`}</span>
          </div>
          <div className='tw-flex tw-items-center'>
            <Switch
              checked={layouts.isEnableEdit}
              onChange={onToggle}
              handleDiameter={28}
              offColor='#be1b20'
              onColor='#0c0f72'
              offHandleColor='#fff'
              onHandleColor='#fff'
              height={20}
              width={40}
              className='react-switch theme-switch tw-px-3'
              id='small-radius-switch'
            />
            <h6 className='tw-text-white m-0'>
              {layouts.isEnableEdit ? 'Enable Edit' : 'Disable Edit'}{' '}
            </h6>
          </div>
        </div>
      </div>

      <div className='app-theme dark:tw-bg-dark-200'>
        <div className='scroll-y mh-325px tw-p-7 tw-border-b dark:tw-border-b-slate-700 tw-border-b-slate-100'>
          {/* {layouts.data.map((theme, index) => ( */}
          {theme.userAllThemes.map((theme, index) => (
            <div
              key={`alert${index}`}
              className={`tw-flex tw-justify-between tw-items-center tw-p-3 last:tw-pb-0 tw-my-3 last:tw-mb-0 ${
                theme.name.toLocaleLowerCase() === selectedTheme
                  ? 'theme-active tw-shadow dark:tw-bg-dark-300 rounded-1'
                  : ''
              }`}
            >
              <div className='tw-flex tw-items-center'>
                <div className='symbol symbol-35px me-4'>
                  <span className={clsx('symbol-label', `tw-bg-slate-100 dark:tw-bg-dark-400`)}>
                    <KTSVG
                      path={`/media/icons/duotune/technology/teh008.svg`}
                      className={`svg-icon-2 svg-icon-primary dark:tw-text-slate-400`}
                    />
                  </span>
                </div>
                <div className='mb-0 me-2'>
                  <a
                    href='#'
                    className='dropdown-title tw-text-md tw-font-semibold dark:tw-text-slate-300'
                  >
                    {theme.name}
                  </a>
                  <div className='tw-text-sm tw-font-medium'>
                    {layouts.haveLocalChange && theme.name.toLocaleLowerCase() === selectedTheme ? (
                      <span className='tw-text-red-600 dark:tw-text-red-700'>
                        You have local changes
                      </span>
                    ) : (
                      <span className='tw-text-slate-400'>{theme.name}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className='themeAction'>
                {layouts.haveLocalChange && theme.name.toLocaleLowerCase() === selectedTheme ? (
                  <>
                    <button
                      className='btn btn-sm tw-bg-gradient-to-r tw-from-blue-800 tw-to-blue-600 tw-text-white'
                      onClick={onLayoutSave}
                      title='Save'
                    >
                      <FiSave className='tw-h-6 tw-p-0' />
                    </button>

                    {theme.name.toLocaleLowerCase() !== 'default' ? (
                      <button
                        className='btn btn-sm btn-info'
                        onClick={() => handleUpdateLayout(theme.name.toLocaleLowerCase())}
                        title='Update'
                      >
                        <FiRefreshCcw className='tw-h-6 tw-p-0' />
                      </button>
                    ) : null}
                    <button
                      className='btn btn-sm btn-warning'
                      onClick={() => handleReset(theme.name.toLocaleLowerCase())}
                      title='Reset'
                    >
                      <FiRotateCw className='tw-h-6 tw-p-0' />
                    </button>
                  </>
                ) : (
                  <>
                    {theme.name.toLocaleLowerCase() !== user.settings.selectedLayout ? (
                      <button
                        className='btn btn-sm btn-success'
                        onClick={() => handleApplyTheme(theme.name.toLocaleLowerCase())}
                        title='Apply'
                      >
                        <FiCheck className='tw-h-6 tw-p-0' />
                      </button>
                    ) : null}
                    {theme.name.toLocaleLowerCase() !== 'default' ? (
                      <button
                        className='btn btn-sm secondary-btn-bg'
                        onClick={() => handleDeleteTheme(theme.name.toLocaleLowerCase())}
                        title='Delete'
                      >
                        <FiTrash2 className='tw-h-6 tw-p-0' />
                      </button>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className='tw-flex tw-items-center tw-justify-around tw-p-7'>
          <div className='tw-text-center tw-border-t-slate-200'></div>
          <div className='tw-text-center tw-border-t-slate-200'>
            <button className='dark:tw-text-white tw-px-4 tw-py-2 tw-border-0 tw-rounded dark:tw-bg-dark-300 tw-bg-slate-200'>
              View All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
