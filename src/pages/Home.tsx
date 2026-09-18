import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shirt, Gift, Box, Sparkles, Truck, ShieldCheck, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Post } from '@/types';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      setPosts(data as Post[] ?? []);
    })();
  }, []);

  const services = [
    { icon: Shirt, title: 'Apparel Line', desc: 'Custom branded t-shirts, hoodies, polos, and hats with premium quality and fast turnaround.', color: 'from-sky-500 to-blue-600' },
    { icon: Gift, title: 'Promotional Products', desc: 'Branded mugs, tumblers, tote bags, lanyards, and more for events and giveaways.', color: 'from-emerald-500 to-teal-600' },
    { icon: Box, title: '3D Printed Products', desc: 'Custom 3D printed items, prototypes, and unique designs brought to life.', color: 'from-amber-500 to-orange-600' },
  ];

  const features = [
    { icon: ShieldCheck, title: 'Secure Checkout', desc: 'Apple Pay and credit card payments processed securely.' },
    { icon: Truck, title: 'Fast Shipping', desc: 'Quick turnaround on all orders, tracked from start to finish.' },
    { icon: Clock, title: 'Custom Orders', desc: 'Submit custom artwork through our customer portal.' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-sky-50">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-200 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 text-sky-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Retail & Custom Promotional Products
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
              Your brand,{' '}
              <span className="bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
                beautifully crafted
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Premium apparel, promotional products, and custom 3D printed items.
              Browse our retail store or submit a custom order with your own artwork.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/retail"
                className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-sky-200 hover:shadow-xl hover:shadow-sky-300"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-semibold transition-all border border-gray-200 shadow-sm"
              >
                Customer Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What We Do</h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Three product lines, one destination for all your branding needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map(service => (
              <div
                key={service.title}
                className="group p-8 rounded-2xl bg-gradient-to-b from-gray-50 to-white border border-gray-100 hover:border-sky-200 hover:shadow-lg transition-all"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 shadow-sm group-hover:scale-105 transition-transform`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.desc}</p>
                <Link to="/retail" className="inline-flex items-center gap-1 mt-4 text-sky-600 hover:text-sky-700 text-sm font-medium">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(feature => (
              <div key={feature.title} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <feature.icon className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Posts / Announcements */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Latest News & Updates</h2>
            <p className="mt-3 text-gray-600">Stay up to date with our newest products and announcements.</p>
          </div>
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">No posts yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.map(post => (
                <article key={post.id} className="group rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all">
                  {post.image_url && (
                    <div className="aspect-video overflow-hidden bg-gray-100">
                      <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-xs text-gray-400 mb-2">
                      {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{post.body}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-sky-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
          <p className="mt-3 text-sky-100">Browse our retail store or submit a custom order with your artwork today.</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/retail" className="px-6 py-3 bg-white text-sky-700 rounded-xl font-semibold hover:bg-sky-50 transition-colors shadow-lg">
              Shop Retail
            </Link>
            <Link to="/login" className="px-6 py-3 bg-sky-500/30 text-white border border-sky-300/30 rounded-xl font-semibold hover:bg-sky-500/50 transition-colors">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
