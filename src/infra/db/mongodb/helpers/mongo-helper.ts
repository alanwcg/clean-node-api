import { Collection, MongoClient } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account'

interface MapperParams {
  insertedData: any
}

export const MongoHelper = {
  client: null as MongoClient,

  async connect (url: string): Promise<void> {
    this.client = await MongoClient.connect(url)
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },

  mapper ({ insertedData }: MapperParams): AccountModel {
    const { _id, ...rest } = insertedData
    return Object.assign({}, { id: _id.toString() }, rest)
  }
}
