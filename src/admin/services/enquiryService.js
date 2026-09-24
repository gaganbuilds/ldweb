import { supabase } from './supabase';

export const enquiryService = {
  /**
   * Fetch paginated internship enquiries with optional filters and sorting
   */
  getEnquiries: async (page = 1, limit = 10, filters = {}, sort = { column: 'created_at', ascending: false }) => {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from('internship_enquiries')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters.domain) {
        query = query.eq('interested_internship', filters.domain);
      }
      if (filters.search) {
        // Search across name, email, phone
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
      }

      // Apply sorting
      query = query.order(sort.column, { ascending: sort.ascending }).range(from, to);

      const { data, error, count } = await query;
      
      if (error) throw error;
      return { data, count, error: null };
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      return { data: null, count: 0, error };
    }
  },

  /**
   * Get a single enquiry by ID
   */
  getEnquiryById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('internship_enquiries')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching enquiry:', error);
      return { data: null, error };
    }
  },

  /**
   * Update an enquiry (status, priority, assigned_to, follow_up_date, notes)
   */
  updateEnquiry: async (id, updates, newActivity = null) => {
    try {
      // First, if there's new activity, we need to fetch the existing history
      let updatedData = { ...updates };
      
      if (newActivity) {
        const { data: current } = await supabase
          .from('internship_enquiries')
          .select('activity_history')
          .eq('id', id)
          .single();
          
        const history = current?.activity_history || [];
        const newHistory = [
          {
            ...newActivity,
            timestamp: new Date().toISOString()
          },
          ...history
        ];
        
        updatedData.activity_history = newHistory;
      }

      const { data, error } = await supabase
        .from('internship_enquiries')
        .update(updatedData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating enquiry:', error);
      return { data: null, error };
    }
  },

  /**
   * Get counts for dashboard summary
   */
  getDashboardStats: async () => {
    try {
      // A more optimized way would be a single RPC or group by, 
      // but making parallel count queries is acceptable for small/medium scale
      
      const [totalRes, newRes, contactedRes, interestedRes, followupRes, convertedRes] = await Promise.all([
        supabase.from('internship_enquiries').select('*', { count: 'exact', head: true }),
        supabase.from('internship_enquiries').select('*', { count: 'exact', head: true }).eq('status', 'New'),
        supabase.from('internship_enquiries').select('*', { count: 'exact', head: true }).eq('status', 'Contacted'),
        supabase.from('internship_enquiries').select('*', { count: 'exact', head: true }).eq('status', 'Interested'),
        supabase.from('internship_enquiries').select('*', { count: 'exact', head: true }).eq('status', 'Follow-up'),
        supabase.from('internship_enquiries').select('*', { count: 'exact', head: true }).eq('status', 'Converted')
      ]);
      
      return {
        total: totalRes.count || 0,
        new: newRes.count || 0,
        contacted: contactedRes.count || 0,
        interested: interestedRes.count || 0,
        followup: followupRes.count || 0,
        converted: convertedRes.count || 0,
        error: null
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return { error };
    }
  }
};
