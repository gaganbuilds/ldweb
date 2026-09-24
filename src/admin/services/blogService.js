import { supabase } from './supabase';

export const blogService = {
  // Fetch blogs (with joined Category and Author data for list view)
  async getBlogs() {
    const { data, error } = await supabase
      .from('blogs')
      .select(`
        *,
        category:blog_categories(name),
        author:blog_authors(name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getBlogById(id) {
    const { data, error } = await supabase
      .from('blogs')
      .select(`
        *,
        category:blog_categories(name, slug),
        author:blog_authors(name, image_url, designation, short_bio),
        blog_tag_relations(
          tag:blog_tags(id, name)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getBlogBySlug(slug) {
    const { data, error } = await supabase
      .from('blogs')
      .select(`
        *,
        category:blog_categories(name, slug),
        author:blog_authors(name, image_url, designation, short_bio, long_bio, linkedin_url, website_url),
        blog_tag_relations(
          tag:blog_tags(id, name, slug)
        )
      `)
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createBlog(blogData, tagIds = []) {
    const { data: blog, error: blogError } = await supabase
      .from('blogs')
      .insert([blogData])
      .select()
      .single();
      
    if (blogError) throw blogError;

    // Insert tag relationships
    if (tagIds.length > 0) {
      const tagRelations = tagIds.map(tagId => ({
        blog_id: blog.id,
        tag_id: tagId
      }));
      await supabase.from('blog_tag_relations').insert(tagRelations);
    }

    return blog;
  },

  async updateBlog(id, blogData, tagIds = []) {
    const { data: blog, error: blogError } = await supabase
      .from('blogs')
      .update(blogData)
      .eq('id', id)
      .select()
      .single();
      
    if (blogError) throw blogError;

    // Update tags (delete existing, then insert new)
    await supabase.from('blog_tag_relations').delete().eq('blog_id', id);
    if (tagIds.length > 0) {
      const tagRelations = tagIds.map(tagId => ({
        blog_id: id,
        tag_id: tagId
      }));
      await supabase.from('blog_tag_relations').insert(tagRelations);
    }

    return blog;
  },

  async deleteBlog(id) {
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (error) throw error;
  },

  // Increment views
  async incrementViews(slug) {
    // In a real app, this should be done via a Supabase RPC (stored procedure)
    // to avoid race conditions. For simplicity here:
    const blog = await this.getBlogBySlug(slug);
    if (blog) {
      await supabase.from('blogs').update({ views: blog.views + 1 }).eq('id', blog.id);
    }
  }
};
