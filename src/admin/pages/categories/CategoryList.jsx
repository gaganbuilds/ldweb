import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, FolderOpen } from 'lucide-react';
import { cmsService } from '../../services/cmsService';
import '../../styles/admin.css';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await cmsService.getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? This might fail if it is linked to blogs.')) return;
    try {
      await cmsService.deleteCategory(id);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Cannot delete category. It might be linked to existing blogs.');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-title">
          <FolderOpen size={24} color="#4f46e5" />
          <h1>Categories</h1>
        </div>
        <Link to="/admin/categories/new" className="admin-btn primary">
          <Plus size={18} />
          Add Category
        </Link>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="admin-empty">
            <FolderOpen size={48} color="#9ca3af" />
            <h3>No categories found</h3>
            <p>Create your first category to organize blogs.</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Slug</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td><strong>{cat.name}</strong></td>
                    <td><code>{cat.slug}</code></td>
                    <td>
                      <div className="admin-table-actions">
                        <Link to={`/admin/categories/${cat.id}/edit`} className="admin-icon-btn edit">
                          <Edit size={18} />
                        </Link>
                        <button onClick={() => handleDelete(cat.id)} className="admin-icon-btn delete">
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
