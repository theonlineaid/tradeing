import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Outlet, useLocation} from 'react-router-dom'
import ALL_CONSTANTS from '../../app/common/constants'
import useFetchData from '../../app/hooks/use-fetch-data-hook'
import {userInfo} from '../../app/modules/auth/core/_requests'
import {RootState} from '../../app/redux'
import {updateLayout} from '../../app/redux/slices/layouts'
import {updateUserProfile} from '../../app/redux/slices/userData'
import {MenuComponent} from '../assets/ts/components'
import {ActivityDrawer} from '../partials'
import IndexWarper from '../partials/layout/index/IndexWarper'
import {Content} from './components/Content'
import {Footer} from './components/Footer'
import {ScrollTop} from './components/ScrollTop'
import {HeaderWrapper} from './components/header/HeaderWrapper'
import {Toolbar} from './components/toolbar/Toolbar'
import {PageDataProvider} from './core'

// const list: any = await shareListInitial(data.data.access_token.replace('Bearer ', ''))
// const orderList: any = await orderList()

const MasterLayout = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.userData.profile)

  const {} = useFetchData({
    url: `${ALL_CONSTANTS.API_URL_2}/${ALL_CONSTANTS.USER_THEME_GET}/${user?.id}/`,
    handleUpdate: updateLayout,
    isUseRedux: true,
  })

  const fetchUser = async () => {
    const result = await userInfo()
    if (result.data?.data) {
      dispatch(updateUserProfile(result.data.data))
    }
  }

  const location = useLocation()
  useEffect(() => {
    setTimeout(() => {
      MenuComponent.reinitialization()
    }, 500)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      MenuComponent.reinitialization()
    }, 500)
    fetchUser()
  }, [location.key])

  return (
    <PageDataProvider>
      <div className='page'>
        {/* <AsideDefault /> */}
        <HeaderWrapper />

        {/* TODO: Index section  */}
        <IndexWarper />

        <div className='d-flex flex-column flex-row-fluid' id='kt_wrapper'>
          <div id='kt_content' className='content d-flex flex-column flex-column-fluid'>
            <Toolbar />
            <div className='post d-flex flex-column-fluid' id='kt_post'>
              <Content>
                <Outlet />
              </Content>
            </div>
          </div>
          <Footer />I
        </div>
      </div>

      {/* begin:: Drawers */}
      <ActivityDrawer />
      {/* end:: Drawers */}

      {/* end:: Modals */}
      <ScrollTop />
    </PageDataProvider>
  )
}

export {MasterLayout}
