import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Check,
  X,
  Layers,
  ExternalLink,
  Image as ImageIcon,
} from 'lucide-react';
import api, { getImageUrl, uploadImage } from '../services/api';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

const emptyServiceForm = {
  id: null,
  title: '',
  slug: '',
  tagline: '',
  short_description: '',
  full_description: '',
  icon_image: '',
  banner_image: '',
  features: '',
  gallery: [],
  is_published: true,
  sort_order: 0,
};

const ServicesManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formState, setFormState] = useState(emptyServiceForm);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Image upload states
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const iconInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { showToast } = useToast();

  const fetchServices = async () => {
    try {
      const res = await api.get('/api/v1/services');
      if (res.data && res.data.data) {
        setServices(res.data.data);
      } else if (Array.isArray(res.data)) {
        setServices(res.data);
      }
    } catch (err) {
      console.warn('Fetch services error:', err.message);
      showToast('Could not load services from API.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const query = searchQuery.toLowerCase();
      return (
        s.title.toLowerCase().includes(query) ||
        s.slug.toLowerCase().includes(query) ||
        (s.short_description && s.short_description.toLowerCase().includes(query))
      );
    });
  }, [services, searchQuery]);

  // Generate slug automatically on title change if creating
  const handleTitleChange = (e) => {
    const val = e.target.value;
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormState((prev) => ({
      ...prev,
      title: val,
      slug: prev.id ? prev.slug : autoSlug,
    }));
  };

  const openAddModal = () => {
    setFormState(emptyServiceForm);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setFormState({
      id: service.id,
      title: service.title || '',
      slug: service.slug || '',
      tagline: service.tagline || '',
      short_description: service.short_description || '',
      full_description: service.full_description || '',
      icon_image: service.icon_image || '',
      banner_image: service.banner_image || '',
      features: Array.isArray(service.features) ? service.features.join('\n') : (service.features || ''),
      gallery: Array.isArray(service.gallery) ? service.gallery : [],
      is_published: !!service.is_published,
      sort_order: service.sort_order || 0,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleIconUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIcon(true);
    try {
      const res = await uploadImage(file);
      if (res && res.path) {
        setFormState((prev) => ({ ...prev, icon_image: res.path }));
        showToast('Icon image uploaded successfully');
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to upload icon image', 'error');
    } finally {
      setUploadingIcon(false);
      e.target.value = '';
    }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBanner(true);
    try {
      const res = await uploadImage(file);
      if (res && res.path) {
        setFormState((prev) => ({ ...prev, banner_image: res.path }));
        showToast('Banner image uploaded successfully');
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to upload banner image', 'error');
    } finally {
      setUploadingBanner(false);
      e.target.value = '';
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingGallery(true);
    try {
      const uploadedPaths = [];
      for (const file of files) {
        const res = await uploadImage(file);
        if (res && res.path) {
          uploadedPaths.push(res.path);
        }
      }
      setFormState((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), ...uploadedPaths],
      }));
      showToast(`${uploadedPaths.length} gallery image(s) uploaded successfully`);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to upload gallery images', 'error');
    } finally {
      setUploadingGallery(false);
      e.target.value = '';
    }
  };

  const removeGalleryImage = (indexToRemove) => {
    setFormState((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormErrors({});

    // Simple frontend validation
    const errors = {};
    if (!formState.title.trim()) errors.title = 'Title is required';
    if (!formState.slug.trim()) errors.slug = 'Slug is required';
    if (!formState.short_description.trim()) errors.short_description = 'Short description is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    const payload = {
      ...formState,
      features: formState.features
        ? formState.features.split('\n').map((f) => f.trim()).filter(Boolean)
        : [],
      gallery: Array.isArray(formState.gallery) ? formState.gallery : [],
    };

    try {
      if (formState.id) {
        // Update
        const res = await api.put(`/api/v1/services/${formState.id}`, payload);
        showToast('Service updated successfully');
        setServices((prev) => prev.map((s) => (s.id === formState.id ? res.data.data : s)));
      } else {
        // Create
        const res = await api.post('/api/v1/services', payload);
        showToast('New service published successfully');
        setServices((prev) => [res.data.data, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      if (err.response?.status === 422 && err.response.data?.errors) {
        setFormErrors(err.response.data.errors);
      } else {
        showToast(err.response?.data?.message || 'Error saving service', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (service) => {
    const nextStatus = !service.is_published;
    try {
      await api.patch(`/api/v1/services/${service.id}/toggle-publish`, {
        is_published: nextStatus,
      });
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, is_published: nextStatus } : s))
      );
      showToast(`Service is now ${nextStatus ? 'Published' : 'Draft'}`);
    } catch {
      showToast('Failed to update service publish status', 'error');
    }
  };

  const confirmDelete = (service) => {
    setServiceToDelete(service);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/api/v1/services/${serviceToDelete.id}`);
      showToast('Service removed successfully');
      setServices((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
      setDeleteModalOpen(false);
      setServiceToDelete(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete service', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="table-toolbar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search services by title or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={16} />
          <span>Add New Service</span>
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            All Company Services ({filteredServices.length})
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Connected directly to public website routes
          </span>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Icon</th>
                <th>Service Name & URL Slug</th>
                <th>Short Overview</th>
                <th style={{ width: '120px' }}>Status</th>
                <th style={{ width: '80px' }}>Order</th>
                <th style={{ textAlign: 'right', width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                    Loading services from MySQL database...
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                    No services found matching your search.
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '6px',
                        background: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}>
                        {service.icon_image ? (
                          <img src={getImageUrl(service.icon_image)} alt="" style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} />
                        ) : (
                          <Layers size={18} color="#31a49c" />
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#001837' }}>{service.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span>/services/{service.slug}</span>
                        <a
                          href={`/services/${service.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open public page"
                          style={{ color: '#31a49c' }}
                        >
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    </td>
                    <td style={{ maxWidth: '320px', fontSize: '0.82rem', color: '#475569' }}>
                      <p style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {service.short_description}
                      </p>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(service)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        title="Click to toggle publish status"
                      >
                        {service.is_published ? (
                          <span className="badge badge-success">
                            <Check size={12} /> Published
                          </span>
                        ) : (
                          <span className="badge badge-warning">
                            <EyeOff size={12} /> Draft
                          </span>
                        )}
                      </button>
                    </td>
                    <td style={{ fontWeight: 600, color: '#64748b' }}>
                      {service.sort_order || 0}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEditModal(service)}
                          title="Edit Service"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => confirmDelete(service)}
                          title="Delete Service"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Service Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{formState.id ? 'Edit Service' : 'Add New Service'}</h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Service Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formState.title}
                      onChange={handleTitleChange}
                      placeholder="e.g. Signages & Visual Branding"
                      required
                    />
                    {formErrors.title && <div className="form-error">{formErrors.title}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">URL Slug *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formState.slug}
                      onChange={(e) => setFormState({ ...formState, slug: e.target.value })}
                      placeholder="e.g. signages"
                      required
                    />
                    {formErrors.slug && <div className="form-error">{formErrors.slug}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Tagline / Subheading</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formState.tagline}
                    onChange={(e) => setFormState({ ...formState, tagline: e.target.value })}
                    placeholder="Brief tagline or specialty"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Short Overview Description *</label>
                  <textarea
                    rows="2"
                    className="form-control"
                    value={formState.short_description}
                    onChange={(e) => setFormState({ ...formState, short_description: e.target.value })}
                    placeholder="Short description displayed on cards and previews..."
                    required
                  ></textarea>
                  {formErrors.short_description && <div className="form-error">{formErrors.short_description}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Full Page Description</label>
                  <textarea
                    rows="4"
                    className="form-control"
                    value={formState.full_description}
                    onChange={(e) => setFormState({ ...formState, full_description: e.target.value })}
                    placeholder="Comprehensive service details, technical capabilities, material specs..."
                  ></textarea>
                </div>

                {/* Image Uploads: Icon & Banner */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  {/* Icon Field */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Icon Image</span>
                      {uploadingIcon && <span style={{ color: '#31a49c', fontSize: '0.75rem' }}>Uploading...</span>}
                    </label>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '6px',
                        border: '1px dashed #cbd5e1',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        position: 'relative'
                      }}>
                        {formState.icon_image ? (
                          <img src={getImageUrl(formState.icon_image)} alt="Icon preview" style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
                        ) : (
                          <ImageIcon size={22} color="#94a3b8" />
                        )}
                      </div>

                      <div style={{ flex: 1 }}>
                        <input
                          type="file"
                          ref={iconInputRef}
                          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                          onChange={handleIconUpload}
                          style={{ display: 'none' }}
                        />
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => iconInputRef.current?.click()}
                          disabled={uploadingIcon}
                          style={{ width: '100%', justifyContent: 'center' }}
                        >
                          <Upload size={14} />
                          <span>{uploadingIcon ? 'Uploading...' : formState.icon_image ? 'Replace Icon' : 'Upload Icon'}</span>
                        </button>
                      </div>

                      {formState.icon_image && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.5rem' }}
                          title="Clear icon"
                          onClick={() => setFormState({ ...formState, icon_image: '' })}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      className="form-control"
                      style={{ fontSize: '0.78rem', padding: '0.35rem 0.6rem' }}
                      value={formState.icon_image}
                      onChange={(e) => setFormState({ ...formState, icon_image: e.target.value })}
                      placeholder="/assets/icons/... or uploaded path"
                    />
                  </div>

                  {/* Banner Field */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Banner Image</span>
                      {uploadingBanner && <span style={{ color: '#31a49c', fontSize: '0.75rem' }}>Uploading...</span>}
                    </label>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <div style={{
                        width: '80px',
                        height: '52px',
                        borderRadius: '6px',
                        border: '1px dashed #cbd5e1',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}>
                        {formState.banner_image ? (
                          <img src={getImageUrl(formState.banner_image)} alt="Banner preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <ImageIcon size={22} color="#94a3b8" />
                        )}
                      </div>

                      <div style={{ flex: 1 }}>
                        <input
                          type="file"
                          ref={bannerInputRef}
                          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                          onChange={handleBannerUpload}
                          style={{ display: 'none' }}
                        />
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => bannerInputRef.current?.click()}
                          disabled={uploadingBanner}
                          style={{ width: '100%', justifyContent: 'center' }}
                        >
                          <Upload size={14} />
                          <span>{uploadingBanner ? 'Uploading...' : formState.banner_image ? 'Replace Banner' : 'Upload Banner'}</span>
                        </button>
                      </div>

                      {formState.banner_image && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.5rem' }}
                          title="Clear banner"
                          onClick={() => setFormState({ ...formState, banner_image: '' })}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      className="form-control"
                      style={{ fontSize: '0.78rem', padding: '0.35rem 0.6rem' }}
                      value={formState.banner_image}
                      onChange={(e) => setFormState({ ...formState, banner_image: e.target.value })}
                      placeholder="/assets/services/... or uploaded path"
                    />
                  </div>
                </div>

                {/* Gallery Images */}
                <div className="form-group" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label className="form-label" style={{ margin: 0 }}>
                      Service Gallery Images ({formState.gallery?.length || 0})
                    </label>
                    <input
                      type="file"
                      ref={galleryInputRef}
                      accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                      multiple
                      onChange={handleGalleryUpload}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => galleryInputRef.current?.click()}
                      disabled={uploadingGallery}
                    >
                      <Upload size={14} />
                      <span>{uploadingGallery ? 'Uploading...' : '+ Add Gallery Images'}</span>
                    </button>
                  </div>

                  {formState.gallery && formState.gallery.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.5rem' }}>
                      {formState.gallery.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          style={{
                            position: 'relative',
                            width: '74px',
                            height: '74px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            overflow: 'hidden',
                            background: '#fff'
                          }}
                        >
                          <img
                            src={getImageUrl(imgUrl)}
                            alt={`Gallery ${idx + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(idx)}
                            style={{
                              position: 'absolute',
                              top: '2px',
                              right: '2px',
                              background: 'rgba(239, 68, 68, 0.9)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '50%',
                              width: '18px',
                              height: '18px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: 0
                            }}
                            title="Remove image"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', padding: '0.5rem 0' }}>
                      No gallery images uploaded for this service yet. Click "+ Add Gallery Images" to upload portfolio photos.
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Key Features (One per line)</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    value={formState.features}
                    onChange={(e) => setFormState({ ...formState, features: e.target.value })}
                    placeholder="Indoor & Outdoor 3D Lettering&#10;Custom Acrylic & Neon Illumination&#10;High Durability & Weather Resistance"
                  ></textarea>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formState.is_published}
                      onChange={(e) => setFormState({ ...formState, is_published: e.target.checked })}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Publish immediately on public website</span>
                  </label>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Sort Order:</span>
                    <input
                      type="number"
                      className="form-control"
                      style={{ width: '80px', padding: '0.35rem 0.5rem' }}
                      value={formState.sort_order}
                      onChange={(e) => setFormState({ ...formState, sort_order: parseInt(e.target.value, 10) || 0 })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : formState.id ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Service"
        message={`Are you sure you want to permanently delete "${serviceToDelete?.title}"? This will remove its page and content from the public website.`}
        confirmText="Delete Service"
        isDanger={true}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setServiceToDelete(null);
        }}
      />
    </div>
  );
};

export default ServicesManager;

