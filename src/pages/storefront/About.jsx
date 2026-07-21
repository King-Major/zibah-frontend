import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Store,
  TrendingUp,
  Heart,
  ArrowRight,
  BookOpen,
  Users,
} from 'lucide-react';
import StoreNavbar from '../../components/storefront/StoreNavbar';
import StoreFooter from '../../components/storefront/StoreFooter';

const About = () => {
  return (
    <div className="min-h-screen bg-white font-body text-slate-900 pb-16 md:pb-28">
      <StoreNavbar />

      {/* HERO */}
      <div className="relative overflow-hidden bg-zibah-stores">
        <div className="absolute top-0 right-0 w-72 h-72 md:w-[32rem] md:h-[32rem] bg-zibah-gold/10 rounded-full blur-3xl -mr-24 -mt-24" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-20 pb-14 md:pt-28 md:pb-20 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-zibah-gold text-[11px] font-bold tracking-[0.2em] uppercase mb-6 border border-white/10">
            About ZIBAH Stores
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.05] max-w-3xl mx-auto">
            Empowering students. <span className="text-zibah-gold">Elevating dreams.</span>
          </h1>
          <p className="mt-6 text-white/70 text-lg max-w-xl mx-auto">
            A student-focused marketplace built to make shopping easier and help
            student businesses thrive.
          </p>
        </div>

        {/* Trust stat bar */}
        <div className="relative z-10 border-t border-white/10 bg-black/10">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-3 divide-x divide-white/10">
            {[
              { value: '2020', label: 'Founded at UNILAG' },
              { value: '50+', label: 'Foundational customers' },
              { value: '3', label: 'Campuses served' },
            ].map((stat) => (
              <div key={stat.label} className="py-6 text-center">
                <p className="font-display font-extrabold text-2xl md:text-3xl text-zibah-gold">{stat.value}</p>
                <p className="text-white/60 text-xs md:text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Intro */}
        <div className="py-16 md:py-20 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-5 leading-snug">
            ZIBAH Stores is a student-focused e-commerce marketplace committed to
            making shopping easier while helping student businesses thrive.
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            We connect students and the wider community to quality products, trusted
            services, and ambitious student entrepreneurs — all centralized on one
            seamless platform.
          </p>
        </div>

        {/* Origin + Community — two-column, bordered, no shadows */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-b border-slate-200">
          <div className="p-8 md:p-10 md:border-r border-slate-200">
            <div className="w-11 h-11 rounded-lg bg-zibah-stores/5 text-zibah-stores flex items-center justify-center mb-5">
              <BookOpen size={22} strokeWidth={1.75} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">How it began</h3>
            <p className="text-slate-600 leading-relaxed">
              Our journey began in 2020 as a humble stationery business serving
              students across the University of Lagos (UNILAG).
            </p>
          </div>

          <div className="p-8 md:p-10 border-t md:border-t-0 border-slate-200">
            <div className="w-11 h-11 rounded-lg bg-zibah-stores/5 text-zibah-stores flex items-center justify-center mb-5">
              <Users size={22} strokeWidth={1.75} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Our community</h3>
            <p className="text-slate-600 leading-relaxed">
              Since then, we have proudly served over 50 foundational customers
              across UNILAG, Yaba College of Technology (YABATECH), and Lagos State
              University of Science and Technology (LASUSTECH), earning their trust
              through quality products and reliable service.
            </p>
          </div>
        </div>

        {/* Evolution */}
        <div className="py-16 md:py-20">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <h3 className="font-display font-bold text-2xl md:text-3xl text-slate-900 mb-5">
              The ZIBAH Evolution
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Today, ZIBAH Stores has evolved into a robust platform where student
              entrepreneurs can showcase their businesses, reach a massive new
              customer base, connect directly with wholesalers, and grow
              sustainably. At the same time, customers enjoy a highly convenient
              shopping experience with access to a wide range of quality products
              at competitive prices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden">
            {[
              { icon: Store, title: 'Grow businesses', copy: 'Giving student vendors a professional digital storefront.' },
              { icon: TrendingUp, title: 'Connect wholesalers', copy: 'Bridging the gap between raw supply and student demand.' },
              { icon: Heart, title: 'Thriving community', copy: 'Every purchase strengthens the student economy.' },
            ].map(({ icon: Icon, title, copy }) => (
              <div key={title} className="bg-white p-8 text-center">
                <Icon className="w-7 h-7 mx-auto text-zibah-stores mb-4" strokeWidth={1.75} />
                <h4 className="font-bold text-slate-900 mb-2">{title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Philosophy */}
        <div className="bg-zibah-stores rounded-2xl p-10 md:p-14 text-center relative overflow-hidden mb-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-zibah-gold/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <GraduationCap size={40} className="mx-auto text-zibah-gold mb-6 relative z-10" strokeWidth={1.5} />
          <p className="text-xl md:text-2xl font-display font-medium text-white leading-relaxed relative z-10 max-w-2xl mx-auto">
            "At ZIBAH, every purchase goes beyond a transaction — it supports a
            student's dream, strengthens a growing business, and contributes to a
            thriving community of young entrepreneurs."
          </p>
          <div className="mt-8 relative z-10">
            <p className="text-zibah-gold font-bold tracking-[0.2em] uppercase text-sm">ZIBAH Stores</p>
            <p className="text-white/70 italic mt-1">Life just got easier.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-zibah-stores bg-zibah-gold hover:bg-[#e5bc45] transition-colors shadow-sm active:scale-95 text-lg"
          >
            Support the Movement <ArrowRight size={20} />
          </Link>
        </div>

        <StoreFooter />
      </div>
    </div>
  );
};

export default About;