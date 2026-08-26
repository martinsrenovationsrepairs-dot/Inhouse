import 'dotenv/config'

export const config = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  appUrl: process.env.APP_URL || `http://127.0.0.1:${process.env.PORT || 3000}`,
  jwtSecret: process.env.SESSION_SECRET || 'development-only-change-me',
  cookieName: process.env.SESSION_COOKIE || 'martins_session',
  uploadDir: process.env.UPLOAD_DIR || 'storage/uploads',
  autoMigrate: process.env.AUTO_MIGRATE !== 'false',
  autoSeedDemo: process.env.AUTO_SEED_DEMO !== 'false',
  trustProxy: process.env.TRUST_PROXY !== 'false',
  database: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'MartinsInHouseDB',
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  },
}

if (config.nodeEnv === 'production' && config.jwtSecret === 'development-only-change-me') {
  throw new Error('SESSION_SECRET is required in production.')
}
