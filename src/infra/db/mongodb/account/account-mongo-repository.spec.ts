import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

let accountCollection: Collection
describe('Account MongoDB Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')

    await accountCollection.deleteMany({})
  })

  describe('add()', () => {
    it('should return an account on add success', async () => {
      const sut = makeSut()

      const account = await sut.add(makeFakeAccountData())

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
  })

  describe('loadByEmail()', () => {
    it('should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(makeFakeAccountData())

      const account = await sut.loadByEmail('any_email@mail.com')

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })

    it('should return null if loadByEmail fails', async () => {
      const sut = makeSut()

      const account = await sut.loadByEmail('any_email@mail.com')

      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    it('should update account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()

      const account = await accountCollection.insertOne(makeFakeAccountData())

      expect(account).not.toHaveProperty('accessToken')

      await sut.updateAccessToken(account.insertedId.toString(), 'any_token')
      const updatedAccount = await accountCollection.findOne({
        _id: account.insertedId
      })

      expect(updatedAccount).toBeTruthy()
      expect(updatedAccount.accessToken).toBe('any_token')
    })
  })
})
