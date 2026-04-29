import React from 'react';

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/15WGT743qv/",
    hoverColor: "hover:text-[#1877F2]",
    paths: ["M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"],
  },
  {
    label: "Twitter",
    href: "https://twitter.com/GreatHireIn",
    hoverColor: "hover:text-blue-500",
    paths: ["M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"],
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/greathire/",
    hoverColor: "hover:text-[#0A66C2]",
    paths: ["M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"],
    extras: [
      { type: "rect", attrs: { x: "2", y: "9", width: "4", height: "12" } },
      { type: "circle", attrs: { cx: "4", cy: "4", r: "2" } },
    ],
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/great_hire?igsh=YnQ1a3g2a3Bhc25p",
    hoverColor: "hover:text-[#E4405F]",
    paths: ["M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"],
    extras: [
      { type: "rect", attrs: { x: "2", y: "2", width: "20", height: "20", rx: "5", ry: "5" } },
      { type: "line", attrs: { x1: "17.5", y1: "6.5", x2: "17.51", y2: "6.5" } },
    ],
  },
  {
    label: "Threads",
    href: "https://www.threads.net/@great_hire",
    hoverColor: "hover:text-blue-500",
    paths: ["M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"],
  },
];

const Footer = () => (
  <footer className="w-full bg-gray-100 text-black border-t-2 border-white dark:border-gray-900 dark:bg-gray-800 dark:text-white transition-colors duration-300">
    <div className="flex flex-col md:flex-row justify-between items-center px-4 py-4">
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-bold mb-1 hover:text-blue-600 transition duration-300 ease-in-out">
          <span className="text-black dark:text-white">Great</span>
          <span className="text-blue-600">Hire</span>
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          © 2026 GreatHire <br />All rights reserved. GreatHire is owned and operated by BABDE Pvt. Ltd.
        </p>
      </div>

      <div className="flex justify-center md:justify-end space-x-6">
        {SOCIAL_LINKS.map(({ label, href, hoverColor, paths, extras }) => (
          <a
            key={label}
            href={href}
            className={`text-gray-500 transition-colors duration-300 ease-in-out transform hover:-translate-y-1 ${hoverColor}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
          >
            <svg className="w-8 h-8 drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              {paths.map((d, i) => <path key={i} d={d} />)}
              {extras?.map((el, i) => {
                if (el.type === "rect") return <rect key={i} {...el.attrs} />;
                if (el.type === "circle") return <circle key={i} {...el.attrs} />;
                if (el.type === "line") return <line key={i} {...el.attrs} />;
                return null;
              })}
            </svg>
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
