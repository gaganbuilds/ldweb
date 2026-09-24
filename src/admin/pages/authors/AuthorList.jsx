import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Users } from 'lucide-react';
import { cmsService } from '../../services/cmsService';
import '../../styles/admin.css';

export default function AuthorList() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const data = await cmsService.getAuthors();
      setAuthors(data || []);
    } catch (error) {
      console.error('Error fetching authors:', error);
      alert('Failed to load authors.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this author? This might fail if they are linked to blogs.')) return;
    try {
      await cmsService.deleteAuthor(id);
      fetchAuthors();
    } catch (error) {
      console.error('Error deleting author:', error);
      alert('Cannot delete author. They might be linked to existing blogs.');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-title">
          <Users size={24} color="#4f46e5" />
          <h1>Authors Management</h1>
        </div>
        <Link to="/admin/authors/new" className="admin-btn primary">
          <Plus size={18} />
          Add New Author
        </Link>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading">Loading authors...</div>
        ) : authors.length === 0 ? (
          <div className="admin-empty">
            <Users size={48} color="#9ca3af" />
            <h3>No authors found</h3>
            <p>Create your first author profile to get started.</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Author Name</th>
                  <th>Designation</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {authors.map((author) => (
                  <tr key={author.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {author.image_url ? (
                          <img src={author.image_url} alt={author.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#64748b' }}>
                            {author.name.charAt(0)}
                          </div>
                        )}
                        <strong>{author.name}</strong>
                      </div>
                    </td>
                    <td>{author.designation}</td>
                    <td>
                      <div className="admin-table-actions">
                        <Link to={`/admin/authors/${author.id}/edit`} className="admin-icon-btn edit" title="Edit">
                          <Edit size={18} />
                        </Link>
                        <button onClick={() => handleDelete(author.id)} className="admin-icon-btn delete" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
