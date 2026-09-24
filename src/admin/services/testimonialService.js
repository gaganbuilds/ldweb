import { supabase } from './supabase';

export const testimonialService = {
  
  /**
   * Fetch all testimonials for admin table, sorted by display_order
   */
  async getAdminTestimonials() {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },

  /**
   * Fetch only published testimonials for the public website
   */
  async getPublicTestimonials() {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },

  /**
   * Fetch a single testimonial by ID (for editing)
   */
  async getTestimonialById(id) {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },

  /**
   * Create a new testimonial
   */
  async createTestimonial(testimonialData) {
    const { data, error } = await supabase
      .from('testimonials')
      .insert([testimonialData])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  /**
   * Update an existing testimonial
   */
  async updateTestimonial(id, testimonialData) {
    const { data, error } = await supabase
      .from('testimonials')
      .update(testimonialData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  /**
   * Delete a testimonial
   */
  async deleteTestimonial(id) {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  },

  /**
   * Upload an image to the testimonial-images bucket
   * Returns the public URL of the uploaded image
   */
  async uploadProfileImage(file) {
    if (!file) return null;
    
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('testimonial-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage
      .from('testimonial-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};
