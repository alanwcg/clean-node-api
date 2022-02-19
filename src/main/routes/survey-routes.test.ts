import { Collection } from 'mongodb'
import request from 'supertest'
import { sign } from 'jsonwebtoken'

import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import env from '../config/env'
import app from '../config/app'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('[POST] /surveys', () => {
    it('should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [
            {
              answer: 'Answer 1',
              image: 'http://image-name.com'
            },
            {
              answer: 'Answer 2'
            }
          ]
        })
        .expect(403)
    })

    it('should return 204 on add survey with valid accessToken', async () => {
      const account = await accountCollection.insertOne({
        name: 'Alan',
        email: 'alancintra@gmail.com',
        password: '123456',
        role: 'admin'
      })
      const id = account.insertedId
      const accessToken = sign({ id }, env.jwtSecret)
      await accountCollection.updateOne(
        { _id: id },
        { $set: { accessToken } }
      )

      await request(app)
        .post('/api/surveys')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          question: 'Question',
          answers: [
            {
              answer: 'Answer 1',
              image: 'http://image-name.com'
            },
            {
              answer: 'Answer 2'
            }
          ]
        })
        .expect(204)
    })
  })
})
