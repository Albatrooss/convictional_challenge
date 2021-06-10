import { Pool } from 'pg';

export default new Pool({
    user: 'postgres',
    password: 'password',
    database: 'convictional',
    port: 5432,
    host: 'localhost',
});
