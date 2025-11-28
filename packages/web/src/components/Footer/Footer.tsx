'use client';

import Link from 'next/link';
import { useTranslation } from '@/i18n/useTranslation';
import './Footer.css';

interface FooterLink {
  title: string;
  url: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

export function Footer() {
  const { t } = useTranslation();

  const productLinks: FooterLink[] = [
    { title: t.footer.product.home, url: '#hero' },
    { title: t.footer.product.features, url: '#features' },
    { title: t.footer.product.benefits, url: '#benefits' },
    { title: t.footer.product.socialProof, url: '#proof' },
  ];

  const companyLinks: FooterLink[] = [
    { title: t.footer.company.about, url: '#' },
    { title: t.footer.company.blog, url: '#' },
    { title: t.footer.company.careers, url: '#' },
    { title: t.footer.company.contact, url: '#' },
  ];

  const resourcesLinks: FooterLink[] = [
    { title: t.footer.resources.docs, url: '#' },
    { title: t.footer.resources.support, url: '#' },
    { title: t.footer.resources.faq, url: '#' },
    { title: t.footer.resources.changelog, url: '#' },
  ];

  const socialLinks: FooterLink[] = [
    { title: t.footer.social.twitter, url: '#' },
    { title: t.footer.social.linkedin, url: '#' },
    { title: t.footer.social.instagram, url: '#' },
    { title: t.footer.social.telegram, url: '#' },
  ];

  const sections: FooterSection[] = [
    { title: t.footer.sections.product, links: productLinks },
    { title: t.footer.sections.company, links: companyLinks },
    { title: t.footer.sections.resources, links: resourcesLinks },
    { title: t.footer.sections.social, links: socialLinks },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Logo and Tagline Section */}
          <div className="footer-brand">
            <Link href="#" className="footer-logo-link">
              <span className="footer-logo-text">{t.footer.brand.name}</span>
            </Link>
            <p className="footer-tagline">{t.footer.brand.tagline}</p>
          </div>

          {/* Menu Sections */}
          <div className="footer-menus">
            {sections.map((section) => (
              <div key={section.title} className="footer-menu-section">
                <h3 className="footer-menu-title">{section.title}</h3>
                <ul className="footer-menu-links">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <Link href={link.url} className="footer-menu-link">
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p className="footer-copyright">{t.footer.copyright}</p>
          <div className="footer-legal">
            <Link href="#" className="footer-legal-link">
              {t.footer.legal.privacy}
            </Link>
            <Link href="#" className="footer-legal-link">
              {t.footer.legal.terms}
            </Link>
            <Link href="#" className="footer-legal-link">
              {t.footer.legal.cookies}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
