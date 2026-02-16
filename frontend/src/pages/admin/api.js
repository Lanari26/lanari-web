const API = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
});

const handleRes = async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
};

export const api = {
    get: (path) => fetch(`${API}${path}`, { headers: headers() }).then(handleRes),
    post: (path, body) => fetch(`${API}${path}`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handleRes),
    patch: (path, body) => fetch(`${API}${path}`, { method: 'PATCH', headers: headers(), body: body ? JSON.stringify(body) : undefined }).then(handleRes),
    put: (path, body) => fetch(`${API}${path}`, { method: 'PUT', headers: headers(), body: JSON.stringify(body) }).then(handleRes),
    del: (path) => fetch(`${API}${path}`, { method: 'DELETE', headers: headers() }).then(handleRes),
};
