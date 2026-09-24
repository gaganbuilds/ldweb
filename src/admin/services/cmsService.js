import { supabase } from './supabase';

export const cmsService = {
  // AUTHORS
  async getAuthors() {
    const { data, error } = await supabase.from('blog_authors').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  async createAuthor(authorData) {
    const { data, error } = await supabase.from('blog_authors').insert([authorData]).select().single();
    if (error) throw error;
    return data;
  },
  async updateAuthor(id, authorData) {
    const { data, error } = await supabase.from('blog_authors').update(authorData).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async deleteAuthor(id) {
    const { error } = await supabase.from('blog_authors').delete().eq('id', id);
    if (error) throw error;
  },

  // CATEGORIES
  async getCategories() {
    const { data, error } = await supabase.from('blog_categories').select('*').order('name', { ascending: true });
    if (error) throw error;
    return data;
  },
  async createCategory(categoryData) {
    const { data, error } = await supabase.from('blog_categories').insert([categoryData]).select().single();
    if (error) throw error;
    return data;
  },
  async updateCategory(id, categoryData) {
    const { data, error } = await supabase.from('blog_categories').update(categoryData).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async deleteCategory(id) {
    const { error } = await supabase.from('blog_categories').delete().eq('id', id);
    if (error) throw error;
  },

  // TAGS
  async getTags() {
    const { data, error } = await supabase.from('blog_tags').select('*').order('name', { ascending: true });
    if (error) throw error;
    return data;
  },
  async createTag(tagData) {
    const { data, error } = await supabase.from('blog_tags').insert([tagData]).select().single();
    if (error) throw error;
    return data;
  },
  async deleteTag(id) {
    const { error } = await supabase.from('blog_tags').delete().eq('id', id);
    if (error) throw error;
  },

  // ADS
  async getAds() {
    const { data, error } = await supabase.from('blog_ads').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  async createAd(adData) {
    const { data, error } = await supabase.from('blog_ads').insert([adData]).select().single();
    if (error) throw error;
    return data;
  },
  async updateAd(id, adData) {
    const { data, error } = await supabase.from('blog_ads').update(adData).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async deleteAd(id) {
    const { error } = await supabase.from('blog_ads').delete().eq('id', id);
    if (error) throw error;
  }
};
