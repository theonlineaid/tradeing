const _PREFIX = 'REACT_APP_'

export function getEnv<T = string>(name: string, _default?: T): T {
  const value = import.meta.env[_PREFIX + name]

  if (!value) {
    if (_default === undefined) {
      console.error(`Environment variable "${_PREFIX + name}" is required`)
    }
  }

  return value as unknown as T
}

export function getEnvNum<T = number>(name: string, _default?: T): T {
  const value = import.meta.env[_PREFIX + name]

  if (!value) {
    if (_default === undefined) {
      console.error(`Environment variable "${_PREFIX + name}" is required`)
    }
  }

  const coerced = Number(value)

  if (isNaN(coerced)) {
    console.error(
      `Value "${value}" in environment variable "${_PREFIX + name}" cannot be coerced to a number`
    )
  }

  return coerced as unknown as T
}

export function getEnvUrl<T = string>(base: string, path: string, _default?: T): T {
  const _BASE = import.meta.env[_PREFIX + base]
  const _PATH = import.meta.env[_PREFIX + path]

  const URL = _BASE + '/' + _PATH

  if (!_BASE || !_PATH) {
    if (_default === undefined) {
      console.error(`Environment variable "${_PREFIX + base} & ${_PREFIX + path}" is required`)
    }
  }

  return URL as unknown as T
}
