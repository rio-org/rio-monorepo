<h1 align="center">
  @rionetwork/subgraph
</h1>
<p align="center">
  A subgraph that indexes Rio Network events
</p>
<p align="center">
  <a href="https://rio.network/">
    <img src="https://img.shields.io/badge/website-rio.network-blue">
  </a>
</p>

## Local Development

Make sure you have Docker installed.

1. Copy `.env.example` to `.env` and fill in the required environment variables.
2. Start the graph node and postgres database with `docker-compose up -d`.
3. Once running, create the subgraph with `pnpm create:local`.
4. Deploy the subgraph with `pnpm deploy:local`.
