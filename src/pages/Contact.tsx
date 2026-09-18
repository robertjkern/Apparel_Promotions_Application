import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase.from('contact_messages').insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      subject: form.subject,
      message: form.message,
    });

    setSubmitting(false);
    if (insertError) {
      setError('Something went wrong. Please try again or call us directly.');
      return;
    }
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactInfo = [
    { icon: MapPin, label: 'Visit Us', value: '123 Commerce Way, Suite 200\nAustin, TX 78701' },
    { icon: Phone, label: 'Call Us', value: '(512) 555-0142' },
    { icon: Mail, label: 'Email Us', value: 'hello@promocraft.com' },
    { icon: Clock, label: 'Hours', value: 'Mon-Fri: 9am - 5pm CST\nSat: 10am - 2pm CST' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 via-white to-sky-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Get in Touch</h1>
          <p className="mt-4 text-lg text-gray-600">
            Have a question or ready to start a custom order? We are here to help.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map(info => (
                  <div key={info.label} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-sky-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{info.label}</h3>
                      <p className="mt-1 text-gray-600 whitespace-pre-line">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map */}
              <div className="mt-8 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <iframe
                  title="Store location map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-97.75,30.26,-97.73,30.28&layer=mapnik&marker=30.2672,-97.7431"
                  className="w-full h-64"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Contact form */}
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Message Sent!</h2>
                  <p className="text-gray-600">Thank you for reaching out. We will get back to you within 1-2 business days.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={e => setForm({ ...form, phone: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                      <input
                        type="text"
                        required
                        value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>
                    {error && (
                      <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
                    )}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white rounded-xl font-semibold transition-colors shadow-sm"
                    >
                      {submitting ? (
                        <>Sending...</>
                      ) : (
                        <><Send className="w-4 h-4" /> Send Message</>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
