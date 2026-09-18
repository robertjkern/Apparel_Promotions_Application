import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Upload, FileCheck, Loader2, Send } from 'lucide-react';

const ACCEPTED_TYPES = ['.ai', '.pdf', '.eps', '.jpeg', '.jpg', '.png'];
const ACCEPTED_MIME = ['application/pdf', 'application/postscript', 'application/illustrator', 'image/jpeg', 'image/png', 'image/jpg'];

export default function CustomOrderForm() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    product_type: 'apparel',
    title: '',
    description: '',
    quantity: 1,
    budget: '',
    deadline: '',
    supplier: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const ext = '.' + selected.name.split('.').pop()?.toLowerCase();
    const isValidExt = ACCEPTED_TYPES.includes(ext);
    const isValidMime = ACCEPTED_MIME.includes(selected.type) || selected.name.match(/\.(ai|eps|pdf|jpeg|jpg|png)$/i);

    if (!isValidExt && !isValidMime) {
      setError(`Invalid file type. Accepted formats: ${ACCEPTED_TYPES.join(', ')}`);
      return;
    }

    if (selected.size > 50 * 1024 * 1024) {
      setError('File too large. Maximum size: 50MB.');
      return;
    }

    setError(null);
    setFile(selected);
  };

  const uploadArtwork = async (): Promise<{ url: string; filename: string; contentType: string } | null> => {
    if (!file || !user) return null;

    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('artwork')
      .upload(fileName, file, { upsert: false });

    setUploading(false);

    if (uploadError) {
      setError('Failed to upload artwork: ' + uploadError.message);
      return null;
    }

    const { data: urlData } = supabase.storage.from('artwork').getPublicUrl(fileName);
    return { url: urlData.publicUrl, filename: file.name, contentType: file.type };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('You must be signed in to submit a custom order.');
      return;
    }

    if (!file) {
      setError('Please attach your artwork file.');
      return;
    }

    setSubmitting(true);

    const artwork = await uploadArtwork();
    if (!artwork) {
      setSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from('custom_orders').insert({
      user_id: user.id,
      product_type: form.product_type,
      title: form.title,
      description: form.description,
      quantity: form.quantity,
      budget: form.budget ? parseFloat(form.budget) : null,
      deadline: form.deadline || null,
      artwork_url: artwork.url,
      artwork_filename: artwork.filename,
      artwork_content_type: artwork.contentType,
      supplier: form.supplier || null,
      status: 'submitted',
    });

    setSubmitting(false);

    if (insertError) {
      setError('Failed to submit order: ' + insertError.message);
      return;
    }

    setSuccess(true);
    setForm({ product_type: 'apparel', title: '', description: '', quantity: 1, budget: '', deadline: '', supplier: '' });
    setFile(null);
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
          <FileCheck className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Order Submitted!</h2>
        <p className="mt-2 text-gray-600">We have received your custom order and will review it shortly. You can track its status in your order history.</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition-colors"
        >
          Submit Another Order
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Submit a Custom Order</h2>
      <p className="text-sm text-gray-500 mb-6">Upload your artwork and tell us what you need. We accept .ai, .pdf, .eps, .jpeg, and .png files.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Product type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Type *</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { value: 'apparel', label: 'Apparel' },
              { value: 'promotional', label: 'Promotional' },
              { value: '3d_printed', label: '3D Printed' },
              { value: 'other', label: 'Other' },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm({ ...form, product_type: opt.value })}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                  form.product_type === opt.value
                    ? 'border-sky-500 bg-sky-50 text-sky-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Company picnic t-shirts"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Describe what you need: colors, sizes, placement, special instructions..."
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Quantity, Budget, Deadline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
            <input
              type="number"
              required
              min={1}
              value={form.quantity}
              onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget (optional)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.budget}
              onChange={e => setForm({ ...form, budget: e.target.value })}
              placeholder="$"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline (optional)</label>
            <input
              type="date"
              value={form.deadline}
              onChange={e => setForm({ ...form, deadline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Supplier preference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Supplier (optional)</label>
          <select
            value={form.supplier}
            onChange={e => setForm({ ...form, supplier: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-white"
          >
            <option value="">No preference</option>
            <option value="sanmar">SanMar (apparel)</option>
            <option value="onestop">OneStop (promotional)</option>
          </select>
        </div>

        {/* File upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Artwork Attachment *</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-sky-400 hover:bg-sky-50/50 transition-all"
          >
            {file ? (
              <div className="flex items-center justify-center gap-2 text-emerald-600">
                <FileCheck className="w-5 h-5" />
                <span className="text-sm font-medium">{file.name}</span>
                <span className="text-xs text-gray-400">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                <p className="text-sm text-gray-500">Click to upload your artwork</p>
                <p className="text-xs text-gray-400">Accepted: {ACCEPTED_TYPES.join(', ')} • Max 50MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".ai,.pdf,.eps,.jpeg,.jpg,.png"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting || uploading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white rounded-xl font-semibold transition-colors shadow-sm"
        >
          {submitting || uploading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> {uploading ? 'Uploading artwork...' : 'Submitting...'}</>
          ) : (
            <><Send className="w-4 h-4" /> Submit Custom Order</>
          )}
        </button>
      </form>
    </div>
  );
}
