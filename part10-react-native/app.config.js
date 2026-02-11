import 'dotenv/config';

export default {
  name: 'rate-repository-app',
  slug: 'rate-repository-app',
  scheme: 'raterepo',
  extra: {
    apolloUri: process.env.APOLLO_URI,
  },
};
