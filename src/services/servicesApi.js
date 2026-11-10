import { servicesData, getServiceBySlug as getStaticServiceBySlug } from '../data/servicesData';

// API base URL from Vite environment or default localhost
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost/aimiac-backend').replace(/\/+$/, '');

/**
 * Format image URL whether it's local static asset or backend uploaded image
 */
export const getImageUrl = (path) => {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('blob:') ||
    path.startsWith('data:')
  ) {
    return path;
  }
  // If uploaded to backend (e.g. /uploads/aim_...)
  if (path.startsWith('/uploads/') || path.startsWith('uploads/')) {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
  }
  // Otherwise it's a client static asset (/assets/...)
  return path.startsWith('/') ? path : `/${path}`;
};

/**
 * Deduce category for services without explicit category column
 */
function deduceCategory(slug = '', title = '') {
  const s = (slug + ' ' + title).toLowerCase();
  if (s.includes('signage')) return 'Signages';
  if (s.includes('sticker') || s.includes('label')) return 'Stickers';
  if (s.includes('branding') || s.includes('vehicle') || s.includes('event')) return 'Branding';
  if (s.includes('print') || s.includes('screen') || s.includes('offset')) return 'Printing';
  if (s.includes('display') || s.includes('metal') || s.includes('acrylic') || s.includes('wood') || s.includes('booth')) return 'Fabrication';
  return 'All';
}

/**
 * Normalize a service item to support both DB field naming and legacy static naming
 */
export const normalizeService = (svc) => {
  if (!svc) return null;

  const rawGallery = Array.isArray(svc.gallery)
    ? svc.gallery
    : typeof svc.gallery === 'string'
    ? JSON.parse(svc.gallery || '[]')
    : [];

  const rawFeatures = Array.isArray(svc.features)
    ? svc.features
    : typeof svc.features === 'string'
    ? JSON.parse(svc.features || '[]')
    : [];

  const rawIcon = svc.icon_image || svc.icon || '/assets/icons/icon-img-3.png';
  const rawBanner = svc.banner_image || svc.heroImg || '/assets/services/signages-hero.jpg';

  return {
    id: svc.id || svc.slug,
    slug: svc.slug,
    title: svc.title,
    tagline: svc.tagline || '',
    shortDesc: svc.short_description || svc.shortDesc || '',
    short_description: svc.short_description || svc.shortDesc || '',
    fullDesc: svc.full_description || svc.fullDesc || svc.short_description || '',
    full_description: svc.full_description || svc.fullDesc || svc.short_description || '',
    icon: getImageUrl(rawIcon),
    icon_image: getImageUrl(rawIcon),
    heroImg: getImageUrl(rawBanner),
    banner_image: getImageUrl(rawBanner),
    features: rawFeatures,
    gallery: rawGallery.map((item) => getImageUrl(item)),
    category: svc.category || deduceCategory(svc.slug, svc.title),
    is_published: svc.is_published !== undefined ? Boolean(svc.is_published) : true,
    sort_order: svc.sort_order || 0,
  };
};

/**
 * Fetch list of published services from PHP API with graceful fallback to static data
 */
export async function fetchPublicServices() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/services/public`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const data = await res.json();
    const list = data.data || data;

    if (Array.isArray(list) && list.length > 0) {
      return list.map(normalizeService);
    }
  } catch (err) {
    console.warn('API services fetch failed, using fallback static services:', err.message);
  }

  // Fallback to static services
  return servicesData.map(normalizeService);
}

/**
 * Fetch a single service by slug from PHP API with graceful fallback
 */
export async function fetchPublicServiceBySlug(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/services/public/${encodeURIComponent(slug)}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.data) {
        return normalizeService(data.data);
      }
    }
  } catch (err) {
    console.warn(`API fetch for service "${slug}" failed, checking local static fallback:`, err.message);
  }

  // Fallback to static service
  const staticSvc = getStaticServiceBySlug(slug);
  return staticSvc ? normalizeService(staticSvc) : null;
}

/**
 * Submit quote or contact enquiry to backend API
 */
export async function submitEnquiry(payload) {
  const res = await fetch(`${API_BASE_URL}/api/v1/enquiries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || errData.error || `Submission failed with HTTP ${res.status}`);
  }

  return await res.json();
}

