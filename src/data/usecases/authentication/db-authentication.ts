import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { AuthenticationModel, Authentication } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const { email, password } = authentication

    const account = await this.loadAccountByEmailRepository.load(email)

    if (account) {
      await this.hashComparer.compare(password, account.password)
    }

    return null
  }
}
