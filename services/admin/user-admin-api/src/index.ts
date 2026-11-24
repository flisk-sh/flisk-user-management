import { Hono } from 'hono';

const app = new Hono();

const users = [
    { id: 'usr_01', name: 'Alex Rivera', email: 'alex.rivera@enterprise.com', role: 'SecurityAdmin', org: 'Engineering', status: 'ACTIVE' },
    { id: 'usr_02', name: 'Devon Chen', email: 'devon.chen@enterprise.com', role: 'ComplianceAuditor', org: 'Legal', status: 'ACTIVE' }
];

app.get('/health', (c) => c.json({ status: 'ok', service: 'user-admin-api', timestamp: new Date().toISOString() }));

app.get('/api/v1/users', (c) => {
    return c.json({
        data: users,
        total: users.length,
        page: 1,
        limit: 20
    });
});

app.get('/api/v1/scim/v2/Users', (c) => {
    return c.json({
        schemas: ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
        totalResults: users.length,
        itemsPerPage: users.length,
        startIndex: 1,
        Resources: users.map((user) => ({
            schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
            id: user.id,
            userName: user.email,
            active: user.status === 'ACTIVE'
        }))
    });
});

export default {
    port: 4010,
    fetch: app.fetch
};
