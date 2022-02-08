import { ObjectId } from 'mongodb'

import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository'
import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
import { UpdateAccessTokenRepository } from 'data/protocols/db/update-access-token-repository'

export class AccountMongoRepository implements
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    await accountCollection.insertOne(accountData)

    return MongoHelper.mapper({ insertedData: accountData })
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const account = await accountCollection.findOne<AccountModel>({ email })

    return account && MongoHelper.mapper({ insertedData: account })
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    await accountCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { accessToken: token } }
    )
  }
}
