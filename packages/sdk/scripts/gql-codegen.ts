export default {
  schema: 'https://api.thegraph.com/subgraphs/name/rio-org/rio-network-goerli',
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
