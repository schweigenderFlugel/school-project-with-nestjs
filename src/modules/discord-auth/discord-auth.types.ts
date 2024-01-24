export type DiscordOAuth2CredentialsResponse = {
  access_token: string,
  expires: number,
  refresh_token: string,
  scope: string,
  token_type: string
}

export type DiscordOAuth2UserDataResponse = {
  id: string,
  username: string,
  email: string,
  avatar: string | null,
  discriminator: string,
}

