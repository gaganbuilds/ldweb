import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Megaphone } from 'lucide-react';
import { cmsService } from '../../services/cmsService';
import '../../styles/admin.css';

export default function AdsList() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const data = await cmsService.getAds();
      setAds(data || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
      alert('Failed to load advertisements.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return;
    try {
      await cmsService.deleteAd(id);
      fetchAds();
    } catch (error) {
      console.error('Error deleting ad:', error);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-title">
          <Megaphone size={24} color="#4f46e5" />
          <h1>Advertisement Blocks</h1>
        </div>
        <Link to="/admin/ads/new" className="admin-btn primary">
          <Plus size={18} />
          Create Ad
        </Link>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading">Loading ads...</div>
        ) : ads.length === 0 ? (
          <div className="admin-empty">
            <Megaphone size={48} color="#9ca3af" />
            <h3>No advertisements found</h3>
            <p>Create promotional blocks to show on the blog pages.</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ad Name</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ads.map((ad) => (
                  <tr key={ad.id}>
                    <td><strong>{ad.name}</strong></td>
                    <td><span className="admin-badge neutral">{ad.position}</span></td>
                    <td>
                      <span className={`admin-badge ${ad.status === 'active' ? 'success' : 'warning'}`}>
                        {ad.status}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <Link to={`/admin/ads/${ad.id}/edit`} className="admin-icon-btn edit">
                          <Edit size={18} />
                        </Link>
                        <button onClick={() => handleDelete(ad.id)} className="admin-icon-btn delete">
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
