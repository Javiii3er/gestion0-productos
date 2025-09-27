const BASE_URL = 'https://fakestoreapi.com';

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function apiGetProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  return handleResponse(res);
}

export async function apiCreateProduct(payload) {
  const res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function apiUpdateProduct(id, payload) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT', // o PATCH según prefieras
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function apiDeleteProduct(id) {
  const res = await fetch(`${BASE_URL}/products/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}
