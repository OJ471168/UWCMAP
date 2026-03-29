import { supabase } from './supabase';

export interface Resource {
  id: number;
  title: string;
  author: string;
  category: string;
  description: string;
  image_url: string;
  link: string;
  created_at: string;
}

export const fetchResources = async (options?: {
  category?: string;
  titleSearch?: string;
  authorSearch?: string;
  ids?: string[];
}): Promise<Resource[]> => {
  let query = supabase.from('resources').select('*');

  if (options?.titleSearch) {
    query = query.ilike('title', `%${options.titleSearch}%`);
  }
  if (options?.authorSearch) {
    query = query.ilike('author', `%${options.authorSearch}%`);
  }
  if (options?.category) {
    query = query.eq('category', options.category);
  }
  if (options?.ids && options.ids.length > 0) {
    query = query.in('id', options.ids);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as Resource[]) || [];
};

export const fetchResourceCategories = async (): Promise<string[]> => {
  const { data } = await supabase.from('resources').select('category');
  if (!data) return [];
  return [...new Set(data.map(item => item.category).filter(Boolean))].slice(0, 3);
};

export const fetchResourceAuthors = async (): Promise<string[]> => {
  const { data } = await supabase.from('resources').select('author');
  if (!data) return [];
  const normalizedAuthors = new Map<string, string>();
  data.forEach(item => {
    if (item.author) {
      const trimmed = item.author.trim();
      normalizedAuthors.set(trimmed.toLowerCase(), trimmed);
    }
  });
  return Array.from(normalizedAuthors.values()).sort();
};
