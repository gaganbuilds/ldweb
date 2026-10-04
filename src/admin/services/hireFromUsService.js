import { supabase } from './supabase';

const TABLE = 'hire_from_us_leads';
export const hireFromUsService = {
  async getLeads({ search = '', status = '', priority = '', company = '', role = '', fromDate = '', toDate = '' } = {}) {
    let query = supabase.from(TABLE).select('*').order('created_at', { ascending: false }).limit(5000);
    if (status) query = query.eq('status', status);
    if (priority) query = query.eq('priority', priority);
    if (company) query = query.ilike('company_name', `%${company}%`);
    if (role) query = query.ilike('job_role', `%${role}%`);
    if (fromDate) query = query.gte('created_at', `${fromDate}T00:00:00`);
    if (toDate) query = query.lte('created_at', `${toDate}T23:59:59`);
    if (search) query = query.or(`company_name.ilike.%${search}%,recruiter_name.ilike.%${search}%,work_email.ilike.%${search}%,job_role.ilike.%${search}%`);
    return query;
  },
  async getSummary() {
    const [total, fresh, active, closed] = await Promise.all([
      supabase.from(TABLE).select('id', { count: 'exact', head: true }),
      supabase.from(TABLE).select('id', { count: 'exact', head: true }).eq('status', 'New'),
      supabase.from(TABLE).select('id', { count: 'exact', head: true }).not('status', 'in', '("Closed","Not Interested")'),
      supabase.from(TABLE).select('id', { count: 'exact', head: true }).eq('status', 'Closed')
    ]);
    return { data: { total: total.count || 0, fresh: fresh.count || 0, active: active.count || 0, closed: closed.count || 0 }, error: total.error || fresh.error || active.error || closed.error };
  },
  createLead: lead => supabase.from(TABLE).insert(lead).select().single(),
  updateLead: (id, updates) => supabase.from(TABLE).update(updates).eq('id', id).select().single(),
  deleteLead: id => supabase.from(TABLE).delete().eq('id', id)
};
