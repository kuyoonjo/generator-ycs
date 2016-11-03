/**
 * Errors
 */

'use strict'

const Errors = [
  {
    code: 400,
    types: ['CastError']
  },
  {
    code: 401,
    types: ['AuthError', 'UnauthorizedError']
  },
  {
    code: 403,
    types: ['PermissonError']
  },
  {
    code: 404,
    types: ['EntityNotFoundError']
  },
  {
    code: 422,
    types: ['ValidationError', 'SyntaxError', 'FileUploadError']
  }
]

export function getErrorStatusCode(error) {
  for(let Error of Errors) {
    if(!!~Error.types.indexOf(error.name)) return Error.code
  }
  return 500
}

export class EntityNotFoundError extends Error {
  constructor(message) {
    super(message || 'Entity not found')
    this.name = 'EntityNotFoundError'
  }
}

export class AuthError extends Error {
  constructor(message) {
    super(message)
    this.name = 'AuthError'
  }
}

export class PermissonError extends Error {
  constructor(message) {
    super(message)
    this.name = 'PermissonError'
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class FileUploadError extends Error {
  constructor(message) {
    super(message)
    this.name = 'FileUploadError'
  }
}
