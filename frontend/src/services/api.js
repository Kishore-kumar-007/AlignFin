// Use environment variable for production (Render), fallback to relative path for local proxy
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function fetchPersonas() {
  const res = await fetch(`${API_BASE}/personas`);
  if (!res.ok) throw new Error('Failed to fetch demo personas');
  return res.json();
}

export async function fetchProducts(category = null) {
  const url = category ? `${API_BASE}/products?category=${category}` : `${API_BASE}/products`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch products catalog');
  return res.json();
}

export async function analyzeRisk(profile) {
  const res = await fetch(`${API_BASE}/profile/analyze-risk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  if (!res.ok) throw new Error('Failed to analyze risk profile');
  return res.json();
}

export async function fetchRecommendations(profile) {
  const res = await fetch(`${API_BASE}/evaluate/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  if (!res.ok) throw new Error('Failed to evaluate product recommendations');
  return res.json();
}

export async function compareProducts(profile, productIds) {
  const res = await fetch(`${API_BASE}/evaluate/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, product_ids: productIds })
  });
  if (!res.ok) throw new Error('Failed to generate product comparison');
  return res.json();
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch(`${API_BASE}/documents/extract`, {
    method: 'POST',
    body: formData
    // Note: Do not set Content-Type header manually when sending FormData, 
    // the browser sets it automatically with the boundary.
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to extract document');
  }
  return res.json();
}
