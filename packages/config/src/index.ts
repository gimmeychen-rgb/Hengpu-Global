export const servicePorts = {
  auth: 3001,
  users: 3002,
  requests: 3003,
  suppliers: 3004,
  matching: 3005,
  projects: 3006,
  web: 3000,
  admin: 3010
};

export const jwtDefaults = {
  secret: process.env.JWT_SECRET || 'hengpu-local-secret',
  expiresIn: '1d'
};
