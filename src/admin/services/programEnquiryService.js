import { supabase } from './supabase';

export const programEnquiryService = {
  getEnquiries: async (page = 1, limit = 10, filters = {}, sort = { column: 'created_at', ascending: false }) => {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from('program_enquiries')
        .select('*', { count: 'exact' });

      if (filters.status) {
        query = query.eq('lead_status', filters.status);
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters.program) {
        query = query.ilike('program_name', `%${filters.program}%`);
      }
      if (filters.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,college.ilike.%${filters.search}%`);
      }

      query = query.order(sort.column, { ascending: sort.ascending }).range(from, to);

      const { data, error, count } = await query;
      
      if (error) throw error;
      return { data, count, error: null };
    } catch (error) {
      console.error('Error fetching program enquiries:', error);
      return { data: null, count: 0, error };
    }
  },

  getEnquiryById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('program_enquiries')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching program enquiry:', error);
      return { data: null, error };
    }
  },

  updateEnquiry: async (id, updates, newActivity = null) => {
    try {
      let updatedData = { ...updates };
      
      if (newActivity) {
        const { data: current } = await supabase
          .from('program_enquiries')
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
        .from('program_enquiries')
        .update(updatedData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating program enquiry:', error);
      return { data: null, error };
    }
  },

  getDashboardStats: async () => {
    try {
      const [totalRes, newRes, contactedRes, interestedRes, followupRes, convertedRes] = await Promise.all([
        supabase.from('program_enquiries').select('*', { count: 'exact', head: true }),
        supabase.from('program_enquiries').select('*', { count: 'exact', head: true }).eq('lead_status', 'New'),
        supabase.from('program_enquiries').select('*', { count: 'exact', head: true }).eq('lead_status', 'Contacted'),
        supabase.from('program_enquiries').select('*', { count: 'exact', head: true }).eq('lead_status', 'Interested'),
        supabase.from('program_enquiries').select('*', { count: 'exact', head: true }).eq('lead_status', 'Follow-up'),
        supabase.from('program_enquiries').select('*', { count: 'exact', head: true }).eq('lead_status', 'Converted')
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
      console.error('Error fetching program dashboard stats:', error);
      return { error };
    }
  }
};
