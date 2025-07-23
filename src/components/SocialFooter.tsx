
import { Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';

export const SocialFooter = () => {
  const socialIcons = [
    { Icon: Facebook, label: 'Facebook' },
    { Icon: Instagram, label: 'Instagram' },
    { Icon: () => (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ), label: 'X (Twitter)' },
    { Icon: Youtube, label: 'YouTube' },
    { Icon: Linkedin, label: 'LinkedIn' },
  ];

  const footerLinks = [
    'Contact us',
    'Privacy',
    'Security',
    'Terms of use',
    'Accessibility'
  ];

  return (
    <footer className="bg-gray-100 bg-opacity-90 backdrop-blur-sm mt-auto">
      {/* Social media section */}
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 text-lg font-medium">Follow us:</span>
              {socialIcons.map(({ Icon, label }) => (
                <button
                  key={label}
                  className="text-gray-600 hover:text-blue-600 transition-colors p-2"
                  aria-label={label}
                >
                  <Icon className="w-6 h-6" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer links */}
      <div className="border-t border-gray-300">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center gap-8">
            {footerLinks.map((link) => (
              <button
                key={link}
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
