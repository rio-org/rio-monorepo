<h1 align="center">
  @rionetwork/db
</h1>
<p align="center">
  A database for the Rio network
</p>
<p align="center">
  <a href="https://rio.network/">
    <img src="https://img.shields.io/badge/website-rio.network-blue">
  </a>
</p>

## Local Development

Make sure you have Docker installed.

1. Copy `.env.example` to `.env` and fill in the required environment variables.
2. Start the postgres database with `pnpm run dev` or `docker-compose up -d`.
3. Once running, run migrations with `pnpm migration:run`.
