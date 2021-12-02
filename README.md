## Coinbase Commerce Express

A simple example of an application that recives cryptocurrencies payments using express and Coibase commerce.

### Environment varibles

In order to work properly, this application needs the following environment variables:

```
COINBASE_API_KEY=<your-coinbase-api-key>
COINBASE_WEBHOOK_SECRET=<your-coinbase-webhook-secret>
DOMAIN=<your-local-or-remote-domain>
```

You can get the api key and webhook secret from your dashboard accounts: https://commerce.coinbase.com/dashboard/settings

and in order to use a https domain you can use Heroku or ngrok