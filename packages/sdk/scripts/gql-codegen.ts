export default {
  schema:
    'https://api.goldsky.com/api/public/project_clsc2dwnz018t01ubfw0idj8d/subgraphs/rio-network-holesky/prod/gn',
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
