import { Collection, MongoClient, ObjectId } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account'

interface MapperParams {
  insertedId: ObjectId
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

  mapper ({ insertedId, insertedData }: MapperParams): AccountModel {
    return Object.assign({}, insertedData, { id: insertedId.toString() })
  }
}
