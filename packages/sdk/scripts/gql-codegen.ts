export default {
  schema:
    'https://api.thegraph.com/subgraphs/name/rio-org/rio-network-goerli-v2',
  documents: ['./src/subgraph/queries.ts'],
  generates: {
    ['./src/subgraph/generated/']: {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false
      }
    }
  },
  hooks: { afterAllFileWrite: ['prettier --write'] }
};
