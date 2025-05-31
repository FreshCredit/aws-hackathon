# FreshCredit

FreshCredit is an AI-powered financial health analysis platform that provides personalized insights into your spending habits and financial behavior.

## Features

- 🔐 Secure authentication with Auth0
- 🏦 Bank account connection via Plaid
- 📊 Transaction analysis and reporting
- 🤖 AI-powered insights using AWS Bedrock (Claude)
- 💬 Plain English explanations with Anthropic Claude
- 🗄️ Secure data storage with Turso (libSQL)

## Tech Stack

- **Frontend**: Next.js 15.3, TypeScript, Tailwind CSS
- **Authentication**: Auth0
- **Database**: Turso (libSQL)
- **APIs**: 
  - Plaid for bank connections
  - AWS Bedrock for report generation
  - Anthropic Claude for explanations

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Auth0 account
- Turso account
- Plaid developer account
- AWS account with Bedrock access
- Anthropic API key

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/FreshCredit/aws-hackathon.git
   cd aws-hackathon
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with the following variables:
   ```env
   # App Info
   NEXT_PUBLIC_APP_NAME=freshcredit

   # Auth0
   AUTH0_SECRET=your-auth0-secret
   AUTH0_BASE_URL=http://localhost:3000
   AUTH0_ISSUER_BASE_URL=your-auth0-domain
   AUTH0_CLIENT_ID=your-auth0-client-id
   AUTH0_CLIENT_SECRET=your-auth0-client-secret

   # Turso
   TURSO_DB_URL=your-turso-db-url
   TURSO_DB_AUTH_TOKEN=your-turso-auth-token

   # Plaid
   PLAID_CLIENT_ID=your-plaid-client-id
   PLAID_SECRET=your-plaid-secret
   PLAID_ENV=sandbox
   PLAID_PRODUCTS=auth,transactions,identity
   PLAID_COUNTRY_CODES=US,CA

   # AWS Bedrock
   AWS_ACCESS_KEY_ID=your-aws-access-key-id
   AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
   AWS_REGION=us-east-1

   # Anthropic
   ANTHROPIC_API_KEY=your-anthropic-api-key
   ```

4. Initialize the database:
   ```bash
   curl -X POST http://localhost:3000/api/init
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "feat: Add your feature"
   ```

3. Push your changes:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request on GitHub

## Testing

```bash
npm run test
```

## Deployment

The application is automatically deployed to production when changes are pushed to the main branch.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Support

For support, email support@freshcredit.com or open an issue on GitHub.
