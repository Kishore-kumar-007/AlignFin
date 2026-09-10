const API_BASE = '/api';

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
