export type Character = {
  id: string;
  name: string;
  image: string | null;
  description: string | null;
  age?: string | null;
  occupation?: string | null;
};

export type Episode = {
  id: string;
  name: string;
  season?: string | null;
  episode?: string | null;
  image?: string | null;
};

export type EpisodeDetail = Episode & {
  airdate?: string | null;
  description?: string | null;
  synopsis?: string | null;
  episodeNumber?: number | null;
};

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  hasMore: boolean;
};
