import { RequiredFieldValidation } from '.'
import { MissingParamError } from '../../errors'

describe('Required Field Validation', () => {
  it('should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('field')

    const error = sut.validate({ name: 'any_name' })

    expect(error).toEqual(new MissingParamError('field'))
  })

  it('should not return if validation succeeds', () => {
    const sut = new RequiredFieldValidation('field')

    const error = sut.validate({ field: 'any_value' })

    expect(error).toBeFalsy()
  })
})
