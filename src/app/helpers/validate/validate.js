class Validate {
  #key
  #value
  #payload
  constructor(key, value, payload = {}) {
    this.data = {}
    this.error = []
    this.#key = key
    this.#value = value
    this.#payload = payload
  }

  string(message = `${this.#key} is must be a string!`) {
    // if error then not execute the logic
    if (this.error.length) return this
    // check the value string or not
    if (typeof this.#value !== 'string') {
      delete this.data[this.#key]
      this.error.push({
        type: 'validation error',
        message,
      })
    } else if (!(this.#key in this.data)) {
      this.data = {
        ...this.data,
        [this.#key]: this.#value,
      }
    }
    return this
  }

  number(message = `${this.#key} is must be a number!`) {
    // if error then not execute the logic
    if (this.error.length) return this
    // check the value number or not
    if (typeof this.#value !== 'number') {
      delete this.data[this.#key]
      this.error.push({
        type: 'validation error',
        message,
      })
    } else if (!(this.#key in this.data)) {
      this.data = {
        ...this.data,
        [this.#key]: this.#value,
      }
    }
    return this
  }

  required(message = `${this.#key} is required!`) {
    // if error then not execute the logic
    if (this.error.length) return this
    // check the value exist or not
    if (!this.#value.toString().trim()) {
      delete this.data[this.#key]
      this.error.push({
        type: 'validation error',
        message,
      })
    } else if (!(this.#key in this.data)) {
      this.data = {
        ...this.data,
        [this.#key]: this.#value,
      }
    }
    return this
  }

  min(message = '') {
    // if error then not execute the logic
    if (this.error.length) return this
    // check the length of string minimum of payload
    if (typeof this.#value === 'string') {
      if (this.#value.length < this.#payload?.min) {
        delete this.data[this.#key]
        this.error.push({
          type: 'validation error',
          message: message ? message : `${this.#key} min length ${this.#payload?.min}`,
        })
      } else if (!(this.#key in this.data)) {
        this.data = {
          ...this.data,
          [this.#key]: this.#value,
        }
      }
      // check the number minimum of payload
    } else if (typeof this.#value === 'number') {
      if (this.#value >= this.#payload?.min) {
        if (!(this.#key in this.data)) {
          this.data = {
            ...this.data,
            [this.#key]: this.#value,
          }
        }
      } else {
        delete this.data[this.#key]

        this.error.push({
          type: 'validation error',
          message: message ? message : `${this.#key} minimum ${this.#payload?.min}`,
        })
      }
    }
    return this
  }
}

export default Validate
