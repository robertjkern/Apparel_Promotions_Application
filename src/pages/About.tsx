import { Target, Eye, Award, Users, TrendingUp, Heart } from 'lucide-react';

export default function About() {
  const values = [
    { icon: Award, title: 'Quality First', desc: 'We source premium materials and partner with trusted suppliers to deliver products that last.' },
    { icon: Users, title: 'Customer Focused', desc: 'Your vision drives everything we do. We work closely with you to bring your ideas to life.' },
    { icon: TrendingUp, title: 'Innovation', desc: 'From traditional apparel to cutting-edge 3D printing, we embrace new technologies.' },
    { icon: Heart, title: 'Community', desc: 'We support local businesses and organizations with fair pricing and dedicated service.' },
  ];

  const stats = [
    { value: '15+', label: 'Years in Business' },
    { value: '5,000+', label: 'Orders Delivered' },
    { value: '500+', label: 'Happy Clients' },
    { value: '3', label: 'Product Lines' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 via-white to-sky-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">About PromoCraft</h1>
          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            We are a retail and custom promotional products company based in Austin, Texas.
            For over 15 years, we have helped businesses, schools, and organizations build
            their brand through high-quality apparel, promotional items, and custom 3D printed products.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-4">
            <p>
              Founded in 2009, PromoCraft started as a small screen-printing shop with a simple mission:
              help local businesses look professional and stand out at events. What began with a single
              heat press and a garage full of blank t-shirts has grown into a full-service promotional
              products company.
            </p>
            <p>
              Over the years, we have expanded our offerings to include three distinct product lines:
              our apparel line featuring premium garments from trusted suppliers like SanMar and OneStop,
              our promotional products line with everything from branded mugs to eco-friendly tote bags,
              and our newest addition, custom 3D printed products.
            </p>
            <p>
              Today, we serve hundreds of clients across the country, from small startups to large
              corporations. Our custom order portal makes it easy to submit your own artwork and
              specifications, while our retail store offers ready-to-ship products for quick turnaround.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-sky-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To empower brands of all sizes with premium promotional products and custom merchandise
              that make a lasting impression. We combine quality materials, expert craftsmanship,
              and exceptional service to deliver products our clients are proud to wear and share.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To be the go-to destination for custom promotional products, apparel, and 3D printed items,
              known for innovation, reliability, and a seamless ordering experience from first click
              to final delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">{stat.value}</p>
                <p className="mt-2 text-sm text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
            <p className="mt-3 text-gray-600">The principles that guide everything we do.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(value => (
              <div key={value.title} className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
