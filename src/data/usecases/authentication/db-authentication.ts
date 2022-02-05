import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { AuthenticationModel, Authentication } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { TokenGenerator } from '../../protocols/criptography/token-generator'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const { email, password } = authentication

    const account = await this.loadAccountByEmailRepository.load(email)

    if (account) {
      const isPasswordValid = await this.hashComparer.compare(
        password,
        account.password
      )

      if (isPasswordValid) {
        const accessToken = await this.tokenGenerator.generate(account.id)

        return accessToken
      }
    }

    return null
  }
}
