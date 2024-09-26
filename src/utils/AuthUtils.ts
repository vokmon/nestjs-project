export const getSecretBufferValue = () =>
  Buffer.from(process.env.AUTH_SECRET, 'utf-8');
