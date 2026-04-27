import React, { useState, useEffect } from "react";

const Footer: React.FC = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    const generateQR = async () => {
      try {
        const QRCode = await import("qrcode");
        const url = await QRCode.default.toDataURL(
          "https://www.babysneakers.com",
          {
            width: 128,
            margin: 1,
          }
        );
        setQrCodeUrl(url);
      } catch (error) {
        console.error("Failed to generate QR code:", error);
      }
    };

    generateQR();
  }, []);

  return (
    <footer className="bg-gray-100/90 dark:bg-gray-900/90 backdrop-blur border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
          <div>
            <div className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-cyan-500">
              Baby Sneakers
            </div>
            <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
              Quality products. Fast support. Secure checkout.
            </p>
            <div className="mt-8 flex items-center gap-6">
              <a
                href="https://www.instagram.com/babysneakersshop?utm_source=qr&igsh=NTh4M3d1NW8wOGR2"
                className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                aria-label="Instagram"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm5.5-2a1 1 0 100 2 1 1 0 000-2z" />
                </svg>
              </a>

              <a
                href="https://www.facebook.com/mira.jokir?mibextid=rS40aB7S9Ucbxw6v"
                className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                aria-label="Facebook"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              <a
                href="https://wa.me/27733857648" // Replace with actual WhatsApp number
                className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400"
                aria-label="WhatsApp"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 text-base w-full md:w-auto">
            <div>
              <div className="font-semibold text-gray-900 dark:text-white mb-4">
                Shop
              </div>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li>
                  <a
                    href="/"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/categories"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Categories
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white mb-4">
                Support
              </div>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li>
                  <a
                    href="/contact"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                    AI Chatbot Assistant
                  </span>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Live Chat
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white mb-4">
                Legal
              </div>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li>
                  <a
                    href="/privacy"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="/cookies"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex-shrink-0 border border-gray-300 dark:border-gray-600 rounded-lg p-2">
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="QR Code for Baby Sneakers"
                className="w-32 h-32"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            )}
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <div>
            © {new Date().getFullYear()} Baby Sneakers. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
