import { Link } from 'react-router-dom';

const StoreFooter = () => {
  // Define social links as an array of objects so you can easily update the URLs later
  const socialLinks = [
    { label: 'TK', url: 'https://www.tiktok.com/@zibahlumina?_r=1&_t=ZS-98BfVxI48Ge' },
    { label: 'F', url: 'https://www.facebook.com/share/1Z2EBcSJ4X' },
    // { label: 'in', url: 'https://linkedin.com' },
    { label: 'IG', url: 'https://www.instagram.com/zibahlumina?igsh=ZmJzcjNkZGloZ3Fz' }
  ];

  return (
    <footer className="mt-12 md:mt-16 pt-10 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
      
      {/* About Section */}
      <div>
        <h5 className="font-display font-bold text-slate-900 mb-3">About</h5>
        <ul className="space-y-2 text-slate-500">
          <li>
            <Link to="/blog" className="hover:text-zibah-stores hover:translate-x-1 inline-block transition-all duration-200">Blog</Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-zibah-stores hover:translate-x-1 inline-block transition-all duration-200">Meet The Team</Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-zibah-stores hover:translate-x-1 inline-block transition-all duration-200">Contact Us</Link>
          </li>
        </ul>
      </div>

      {/* Support Section */}
      <div>
        <h5 className="font-display font-bold text-slate-900 mb-3">Support</h5>
        <ul className="space-y-2 text-slate-500">
          <li>
            <Link to="/contact" className="hover:text-zibah-stores hover:translate-x-1 inline-block transition-all duration-200">Contact Us</Link>
          </li>
          <li>
            <Link to="/shipping" className="hover:text-zibah-stores hover:translate-x-1 inline-block transition-all duration-200">Shipping</Link>
          </li>
          <li>
            <Link to="/returns" className="hover:text-zibah-stores hover:translate-x-1 inline-block transition-all duration-200">Return</Link>
          </li>
          <li>
            <Link to="/faq" className="hover:text-zibah-stores hover:translate-x-1 inline-block transition-all duration-200">FAQ</Link>
          </li>
        </ul>
      </div>

      {/* Social Media Section */}
      <div className="col-span-2 md:col-span-2 md:text-right">
        <h5 className="font-display font-bold text-slate-900 mb-3">Social Media</h5>
        <div className="flex md:justify-end gap-3">
          {socialLinks.map(({ label, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-zibah-stores text-white text-xs font-bold flex items-center justify-center hover:bg-zibah-gold hover:-translate-y-1 transition-all duration-300 shadow-sm"
              aria-label={`Visit our ${label} page`}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Legal Footer */}
      <div className="col-span-2 md:col-span-4 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between text-xs text-slate-400">
        <p>Copyright © 2026 Zibah Stores. All Rights Reserved.</p>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <Link to="/terms" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
        </div>
      </div>
      
    </footer>
  );
};

export default StoreFooter;