import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Briefcase, 
  CalendarDays, 
  FileText, 
  MessageSquare, 
  LayoutTemplate,
  Settings,
  LogOut,
  Users,
  FolderOpen,
  Tag,
  Megaphone,
  Inbox
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function AdminSidebar({ isOpen, onClose }) {
  const { signOut } = useAuth();

  return (
    <>
      <div className={`admin-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-logo">
          <img src="/logo.svg" alt="LearnDepth" onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<strong>LearnDepth Admin</strong>'; }} />
        </div>

        <nav className="admin-sidebar-nav">
          <div className="admin-nav-group">
            <NavLink to="/admin/dashboard" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
          </div>

          <div className="admin-nav-group">
            <div className="admin-nav-title">Content Management</div>
            <div className="admin-nav-item disabled">
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><BookOpen size={18} /> Courses</span>
              <span className="admin-coming-soon">Soon</span>
            </div>
            <div className="admin-nav-item disabled">
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Briefcase size={18} /> Internships</span>
              <span className="admin-coming-soon">Soon</span>
            </div>
            <div className="admin-nav-item disabled">
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><CalendarDays size={18} /> Workshops</span>
              <span className="admin-coming-soon">Soon</span>
            </div>
            <NavLink to="/admin/blogs" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><FileText size={18} /> Blogs</span>
            </NavLink>
            <NavLink to="/admin/testimonials" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><MessageSquare size={18} /> Testimonials</span>
            </NavLink>
          </div>

          <div className="admin-nav-group">
            <div className="admin-nav-title">Lead Management</div>
            <NavLink to="/admin/program-enquiries" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Inbox size={18} /> Program Enquiries</span>
            </NavLink>
            <NavLink to="/admin/internship-enquiries" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Inbox size={18} /> Internship Enquiries</span>
            </NavLink>
            <NavLink to="/admin/hire-from-us" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Briefcase size={18} /> Hire From Us</span>
            </NavLink>
          </div>

          <div className="admin-nav-group">
            <div className="admin-nav-title">Website</div>
            <div className="admin-nav-item disabled">
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><LayoutTemplate size={18} /> Homepage</span>
              <span className="admin-coming-soon">Soon</span>
            </div>
          </div>

          <div className="admin-nav-group">
            <div className="admin-nav-title">Careers</div>
            <NavLink to="/admin/jobs" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Briefcase size={18} /> Jobs</span>
            </NavLink>
            <NavLink to="/admin/job-categories" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><FolderOpen size={18} /> Job Categories</span>
            </NavLink>
            <NavLink to="/admin/applications" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Inbox size={18} /> Applications</span>
            </NavLink>
          </div>

          <div className="admin-nav-group">
            <div className="admin-nav-title">CMS Data</div>
            <NavLink to="/admin/authors" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Users size={18} /> Authors</span>
            </NavLink>
            <NavLink to="/admin/categories" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><FolderOpen size={18} /> Categories</span>
            </NavLink>
            <NavLink to="/admin/tags" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Tag size={18} /> Tags</span>
            </NavLink>
            <NavLink to="/admin/ads" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Megaphone size={18} /> Ad Blocks</span>
            </NavLink>
          </div>
          
          <div className="admin-nav-group">
            <div className="admin-nav-title">System</div>
            <div className="admin-nav-item disabled">
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Settings size={18} /> Settings</span>
              <span className="admin-coming-soon">Soon</span>
            </div>
          </div>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={() => signOut()}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
