import { fetchWithTimeout } from '@/core/api/client';
import { Character, Episode, EpisodeDetail, PaginatedResponse } from '@/core/api/types';

const API_BASE_URL = 'https://thesimpsonsapi.com/api';
const CDN_BASE_URL = 'https://cdn.thesimpsonsapi.com/500';
const EPISODE_CDN_BASE_URL = 'https://cdn.thesimpsonsapi.com/200';
const EPISODE_DETAIL_CDN_BASE_URL = 'https://cdn.thesimpsonsapi.com/500';
const PAGE_SIZE = 20;

function normalizeArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) {
    return data as T[];
  }
  if (data && typeof data === 'object') {
    const maybeObject = data as { results?: T[]; items?: T[]; result?: T[] };
    return maybeObject.results ?? maybeObject.items ?? maybeObject.result ?? [];
  }
  return [];
}

function normalizeHasMore(items: unknown[], page: number, total?: number) {
  if (typeof total === 'number') {
    return page * PAGE_SIZE < total;
  }
  return items.length === PAGE_SIZE;
}

export async function getCharacters(params: {
  page: number;
  nameQuery?: string;
}): Promise<PaginatedResponse<Character>> {
  const url = new URL(`${API_BASE_URL}/characters`);
  url.searchParams.set('page', String(params.page));
  if (params.nameQuery) {
    url.searchParams.set('name', params.nameQuery);
  }

  const response = await fetchWithTimeout(url.toString());
  if (!response.ok) {
    throw new Error('FAILED_CHARACTERS');
  }
  const data = await response.json();
  const rawItems = normalizeArray<Record<string, unknown>>(data);
  const total = (data as { total?: number }).total;

  const items = rawItems.map((item) => ({
    id: String(item.id ?? item.character_id ?? item.slug ?? item.name),
    name: String(item.name ?? item.character ?? 'Unknown'),
    image:
      typeof item.portrait_path === 'string'
        ? `${CDN_BASE_URL}${item.portrait_path}`
        : typeof item.image === 'string'
        ? item.image
        : (item.image as string) ?? null,
    description:
      typeof item.description === 'string'
        ? item.description
        : typeof item.about === 'string'
        ? item.about
        : null,
    age: typeof item.age === 'string' ? item.age : null,
    occupation: typeof item.occupation === 'string' ? item.occupation : null,
  }));

  return { items, page: params.page, hasMore: normalizeHasMore(items, params.page, total) };
}

export async function getCharacterById(id: string): Promise<Character> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/characters/${id}`);
  if (!response.ok) {
    throw new Error('FAILED_CHARACTER');
  }
  const data = await response.json();
  const raw = Array.isArray(data) ? data[0] : data;
  return {
    id: String(raw.id ?? raw.character_id ?? raw.slug ?? raw.name ?? id),
    name: String(raw.name ?? raw.character ?? 'Unknown'),
    image:
      typeof raw.portrait_path === 'string'
        ? `${CDN_BASE_URL}${raw.portrait_path}`
        : typeof raw.image === 'string'
        ? raw.image
        : null,
    description:
      typeof raw.description === 'string'
        ? raw.description
        : typeof raw.about === 'string'
        ? raw.about
        : null,
    age: typeof raw.age === 'string' ? raw.age : null,
    occupation: typeof raw.occupation === 'string' ? raw.occupation : null,
  };
}

export async function getEpisodes(params: { page: number }): Promise<PaginatedResponse<Episode>> {
  const url = new URL(`${API_BASE_URL}/episodes`);
  url.searchParams.set('page', String(params.page));
  const response = await fetchWithTimeout(url.toString());
  if (!response.ok) {
    throw new Error('FAILED_EPISODES');
  }
  const data = await response.json();
  const rawItems = normalizeArray<Record<string, unknown>>(data);
  const total = (data as { total?: number }).total;
  const items = rawItems.map((item) => ({
    id: String(item.id ?? item.episode_id ?? item.name),
    name: String(item.name ?? item.title ?? 'Unknown'),
    season: typeof item.season === 'string' ? item.season : null,
    episode: typeof item.episode === 'string' ? item.episode : null,
    image:
      typeof item.image_path === 'string'
        ? `${EPISODE_CDN_BASE_URL}${item.image_path}`
        : typeof item.image === 'string'
        ? item.image
        : null,
  }));
  return { items, page: params.page, hasMore: normalizeHasMore(items, params.page, total) };
}

export async function getEpisodeById(id: string): Promise<EpisodeDetail> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/episodes/${id}`);
  if (!response.ok) {
    throw new Error('FAILED_EPISODE');
  }
  const data = await response.json();
  const raw = Array.isArray(data) ? data[0] : data;
  return {
    id: String(raw.id ?? raw.episode_id ?? id),
    name: String(raw.name ?? raw.title ?? 'Unknown'),
    season: raw.season != null ? String(raw.season) : null,
    episode: raw.episode_number != null ? String(raw.episode_number) : null,
    image:
      typeof raw.image_path === 'string'
        ? `${EPISODE_DETAIL_CDN_BASE_URL}${raw.image_path}`
        : typeof raw.image === 'string'
        ? raw.image
        : null,
    airdate: typeof raw.airdate === 'string' ? raw.airdate : null,
    description: typeof raw.description === 'string' ? raw.description : null,
    synopsis: typeof raw.synopsis === 'string' ? raw.synopsis : null,
    episodeNumber: typeof raw.episode_number === 'number' ? raw.episode_number : null,
  };
}
