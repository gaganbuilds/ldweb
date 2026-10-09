import { supabase } from './supabase';

export const certificateService = {
  // Fetch all certificates (Admin)
  async getCertificates(page = 1, limit = 15, filters = {}, sort = { column: 'created_at', ascending: false }) {
    try {
      let query = supabase
        .from('certificates')
        .select('*, category:certificate_categories(name, slug)', { count: 'exact' });

      // Apply Filters
      if (filters.search) {
        query = query.or(`certificate_number.ilike.%${filters.search}%,recipient_name.ilike.%${filters.search}%,certificate_title.ilike.%${filters.search}%`);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }

      // Apply Sorting
      if (sort.column) {
        query = query.order(sort.column, { ascending: sort.ascending });
      }

      // Apply Pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;
      
      return { data, count, error: null };
    } catch (error) {
      console.error('Error fetching certificates:', error);
      return { data: null, count: 0, error };
    }
  },

  // Get a single certificate by ID (Admin)
  async getCertificateById(id) {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*, category:certificate_categories(name, slug)')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching certificate:', error);
      return { data: null, error };
    }
  },

  // Verify certificate by number (Public)
  async verifyCertificate(certificateNumber) {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*, category:certificate_categories(name, slug)')
        .eq('certificate_number', certificateNumber)
        .single();
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error verifying certificate:', error);
      return { data: null, error };
    }
  },

  // Create new certificate
  async createCertificate(certificateData) {
    try {
      // Check if number exists
      const { data: existing } = await supabase
        .from('certificates')
        .select('id')
        .eq('certificate_number', certificateData.certificate_number)
        .single();
        
      if (existing) {
        return { data: null, error: new Error('Certificate number already exists.') };
      }

      const { data, error } = await supabase
        .from('certificates')
        .insert([certificateData])
        .select()
        .single();
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating certificate:', error);
      return { data: null, error };
    }
  },

  // Update certificate
  async updateCertificate(id, updates) {
    try {
      // If updating number, check uniqueness
      if (updates.certificate_number) {
        const { data: existing } = await supabase
          .from('certificates')
          .select('id')
          .eq('certificate_number', updates.certificate_number)
          .neq('id', id)
          .single();
          
        if (existing) {
          return { data: null, error: new Error('Certificate number already exists.') };
        }
      }

      const { data, error } = await supabase
        .from('certificates')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating certificate:', error);
      return { data: null, error };
    }
  },

  // Delete certificate
  async deleteCertificate(id) {
    try {
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error deleting certificate:', error);
      return { error };
    }
  },

  // Get categories
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('certificate_categories')
        .select('*')
        .eq('active', true)
        .order('name');
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { data: null, error };
    }
  },

  // Bulk Insert for CSV
  async bulkInsertCertificates(certificatesData) {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .insert(certificatesData)
        .select();
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error bulk inserting certificates:', error);
      return { data: null, error };
    }
  }
};
