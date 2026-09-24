import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { navigation } from '../data/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  // Body scroll lock
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  return (
    <header className={styles.navbarContainer}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <a href="/">
            <span className={styles.logoText}>Learn Depth<span className={styles.tm}>™</span></span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          <ul className={styles.navItems}>
            {navigation.map((nav, index) => {
              const isActive = typeof window !== 'undefined' && window.location.pathname.startsWith(nav.href) && nav.href !== '/';
              const isExactActive = typeof window !== 'undefined' && window.location.pathname === nav.href;
              const activeClass = (isActive || isExactActive) ? styles.activeLink : '';

              if (nav.items) {
                return (
                  <li key={index} className={styles.navItem}>
                    <button 
                      className={`${styles.navButton} ${activeClass}`}
                      onClick={() => toggleDropdown(index)}
                      aria-expanded={openDropdownIndex === index}
                    >
                      {nav.label}
                      <ChevronDown className={styles.chevron} size={16} />
                    </button>
                    
                    <div className={`${styles.dropdown} ${openDropdownIndex === index ? styles.dropdownOpen : ''}`}>
                      <ul className={styles.dropdownList}>
                        {nav.items.map((item, itemIndex) => (
                          <li key={itemIndex}>
                            <a href={item.href} className={styles.dropdownLink}>{item.label}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              }

              return (
                <li key={index} className={styles.navItem}>
                  <a 
                    href={nav.href} 
                    className={`${styles.navButton} ${activeClass}`}
                    target={nav.external ? "_blank" : undefined}
                    rel={nav.external ? "noopener noreferrer" : undefined}
                  >
                    {nav.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.navActions}>
          <a href="/programs" className={styles.primaryCta}>Explore Programs</a>
          
          <button 
            className={styles.mobileMenuBtn}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`} onClick={(e) => {
        if (e.target === e.currentTarget) setIsMobileMenuOpen(false);
      }}>
        <div className={styles.mobileMenuPanel}>
          <div className={styles.mobileNavHeader}>
            <span className={styles.logoText}>Learn Depth<span className={styles.tm}>™</span></span>
            <button className={styles.mobileCloseBtn} onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>
          
          <ul className={styles.mobileNavItems}>
            {navigation.map((nav, index) => {
              const isActive = typeof window !== 'undefined' && window.location.pathname.startsWith(nav.href) && nav.href !== '/';
              const isExactActive = typeof window !== 'undefined' && window.location.pathname === nav.href;
              const activeClass = (isActive || isExactActive) ? styles.activeMobileLink : '';

              if (nav.items) {
                return (
                  <li key={index} className={styles.mobileNavItem}>
                    <button 
                      className={`${styles.mobileNavButton} ${activeClass}`}
                      onClick={() => toggleDropdown(index)}
                    >
                      {nav.label}
                      <ChevronDown 
                        className={`${styles.mobileChevron} ${openDropdownIndex === index ? styles.rotateChevron : ''}`} 
                        size={20} 
                      />
                    </button>
                    <div className={`${styles.mobileDropdown} ${openDropdownIndex === index ? styles.mobileDropdownOpen : ''}`}>
                      <ul className={styles.mobileDropdownList}>
                        {nav.items.map((item, itemIndex) => (
                          <li key={itemIndex}>
                            <a 
                              href={item.href} 
                              className={styles.mobileDropdownLink}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              }

              return (
                <li key={index} className={styles.mobileNavItem}>
                  <a 
                    href={nav.href}
                    className={`${styles.mobileNavButton} ${activeClass}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    target={nav.external ? "_blank" : undefined}
                    rel={nav.external ? "noopener noreferrer" : undefined}
                  >
                    {nav.label}
                  </a>
                </li>
              );
            })}
          </ul>
          <div className={styles.mobileNavFooter}>
             <a href="/programs" className={styles.primaryCtaMobile} onClick={() => setIsMobileMenuOpen(false)}>Explore Programs</a>
          </div>
        </div>
      </div>
    </header>
  );
}
