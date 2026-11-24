import { expect, test } from 'bun:test';
import server from './index';

test('the SCIM list returns every demo directory user', async () => {
    const directoryResponse = await server.fetch(new Request('http://localhost/api/v1/users'));
    const scimResponse = await server.fetch(new Request('http://localhost/api/v1/scim/v2/Users'));
    expect(directoryResponse.status).toBe(200);
    expect(scimResponse.status).toBe(200);

    const directory = await directoryResponse.json() as {
        total: number;
        data: { id: string; email: string; status: string }[];
    };
    const scim = await scimResponse.json();
    expect(directory.data.map(({ id }) => id)).toEqual(['usr_01', 'usr_02']);
    expect(scim.Resources).toEqual(directory.data.map((user) => ({
        schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
        id: user.id,
        userName: user.email,
        active: user.status === 'ACTIVE'
    })));
    expect(scim.totalResults).toBe(directory.total);
    expect(scim.itemsPerPage).toBe(scim.Resources.length);
    expect(scim.startIndex).toBe(1);
});
