import React, {useState} from 'react'
import {getLayout, ILayout, LayoutSetup, useLayout} from '../../../../_metronic/layout/core'

const TemplateSettings: React.FC<React.PropsWithChildren> = () => {
  const [config, setConfig] = useState<ILayout>(getLayout())

  // update data
  const updateData = (fieldsToUpdate: Partial<ILayout>) => {
    const updatedData = {...config, ...fieldsToUpdate}
    setConfig(updatedData)
  }

  // save preview
  const {setLayout} = useLayout()
  const [configLoading, setConfigLoading] = useState<boolean>(false)
  const [resetLoading, setResetLoading] = useState<boolean>(false)

  const updateConfig = (e: any) => {
    e.preventDefault()
    setConfigLoading(true)
    try {
      LayoutSetup.setConfig(config)
    } catch (error) {
      setConfig(getLayout())
    }
    setTimeout(() => {
      setLayout(config)
      setConfigLoading(false)
    }, 1000)
  }

  // reset
  const reset = () => {
    setResetLoading(true)
    setTimeout(() => {
      setConfig(getLayout())
      setResetLoading(false)
    }, 1000)
  }

  return (
    <>
      <div className='card-body template_settings'>
        <div className='row mb-10'>
          <label className='col-lg-3 col-form-label text-lg-end'>Display:</label>
          <div className='col-lg-9 col-xl-4'>
            <div className='switch switch-icon'>
              <div className='form-check form-check-custom form-check-solid form-switch mb-2'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  name='layout-builder[layout][aside][display]'
                  checked={config.aside.display}
                  onChange={() =>
                    updateData({
                      aside: {
                        ...config.aside,
                        display: !config.aside.display,
                      },
                    })
                  }
                />
              </div>
            </div>
            <div className='form-text text-muted'>Display Aside</div>
          </div>
        </div>
        <div className='row mb-10'>
          <label className='col-lg-3 col-form-label text-lg-end'>Theme:</label>
          <div className='col-lg-9 col-xl-4'>
            <select
              className='form-select form-select-solid'
              name='layout-builder[layout][aside][theme]'
              value={config.aside.theme}
              onChange={(e) =>
                updateData({
                  aside: {
                    ...config.aside,
                    theme: e.target.value as 'dark' | 'light',
                  },
                })
              }
            >
              <option value='dark'>Dark</option>
              <option value='light'>Light</option>
            </select>
            <div className='form-text text-muted'>Select header left content type.</div>
          </div>
        </div>
        <div className='row mb-10'>
          <label className='col-lg-3 col-form-label text-lg-end'>Fixed:</label>
          <div className='col-lg-9 col-xl-4'>
            <div className='switch switch-icon'>
              <div className='form-check form-check-custom form-check-solid form-switch mb-2'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  name='layout-builder[layout][aside][fixed]'
                  checked={config.aside.fixed}
                  onChange={() =>
                    updateData({
                      aside: {
                        ...config.aside,
                        fixed: !config.aside.fixed,
                      },
                    })
                  }
                />
              </div>
            </div>
            <div className='form-text text-muted'>Enable fixed aside</div>
          </div>
        </div>
        <div className='row mb-10'>
          <label className='col-lg-3 col-form-label text-lg-end'>Minimize:</label>
          <div className='col-lg-9 col-xl-4'>
            <div className='switch switch-icon'>
              <div className='form-check form-check-custom form-check-solid form-switch mb-2'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  name='layout-builder[layout][aside][minimize]'
                  checked={config.aside.minimize}
                  onChange={() =>
                    updateData({
                      aside: {
                        ...config.aside,
                        minimize: !config.aside.minimize,
                      },
                    })
                  }
                />
              </div>
            </div>
            <div className='form-text text-muted'>Enable aside minimization</div>
          </div>
        </div>
        <div className='row mb-10'>
          <label className='col-lg-3 col-form-label text-lg-end'>Minimized:</label>
          <div className='col-lg-9 col-xl-4'>
            <div className='switch switch-icon'>
              <div className='form-check form-check-custom form-check-solid form-switch mb-2'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  name='layout-builder[layout][aside][minimized]'
                  checked={config.aside.minimized}
                  onChange={() =>
                    updateData({
                      aside: {
                        ...config.aside,
                        minimized: !config.aside.minimized,
                      },
                    })
                  }
                />
              </div>
            </div>
            <div className='form-text text-muted'>Default minimized aside</div>
          </div>
        </div>
        <div className='row mb-10'>
          <label className='col-lg-3 col-form-label text-lg-end'>Hoverable:</label>
          <div className='col-lg-9 col-xl-4'>
            <div className='switch switch-icon'>
              <div className='form-check form-check-custom form-check-solid form-switch mb-2'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  name='layout-builder[layout][aside][hoverable]'
                  checked={config.aside.hoverable}
                  onChange={() =>
                    updateData({
                      aside: {
                        ...config.aside,
                        hoverable: !config.aside.hoverable,
                      },
                    })
                  }
                />
              </div>
            </div>
            <div className='form-text text-muted'>Enable hoverable minimized aside</div>
          </div>
        </div>
      </div>
      <div className='card-footer py-6'>
        <div className='row'>
          <div className='col-lg-3'></div>
          <div className='col-lg-9'>
            <button type='button' onClick={updateConfig} className='btn btn-primary me-2'>
              {!configLoading && <span className='indicator-label'>Preview</span>}
              {configLoading && (
                <span className='indicator-progress' style={{display: 'block'}}>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>

            <button
              type='button'
              id='kt_layout_builder_reset'
              className='btn btn-active-light btn-color-muted'
              onClick={reset}
            >
              {!resetLoading && <span className='indicator-label'>Reset</span>}
              {resetLoading && (
                <span className='indicator-progress' style={{display: 'block'}}>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export {TemplateSettings}
