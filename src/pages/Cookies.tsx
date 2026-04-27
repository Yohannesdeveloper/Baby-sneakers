import React from "react";

const Cookies: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-6 sm:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Cookie Policy
        </h1>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            This Cookie Policy explains how Baby Sneakers uses cookies and
            similar technologies to recognize you when you visit our website. It
            explains what these technologies are and why we use them, as well as
            your rights to control our use of them.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            What are Cookies?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Cookies are small data files that are placed on your computer or
            mobile device when you visit a website. Cookies are widely used by
            website owners in order to make their websites work, or to work more
            efficiently, as well as to provide reporting information.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            How We Use Cookies
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We use cookies for several reasons:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
            <li>To enable certain functions of the service</li>
            <li>To provide analytics</li>
            <li>To store your preferences</li>
            <li>
              To enable advertisements delivery, including behavioral
              advertising
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Types of Cookies We Use
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We use the following types of cookies:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
            <li>
              <strong>Essential Cookies:</strong> These cookies are necessary
              for the website to function and cannot be switched off in our
              systems.
            </li>
            <li>
              <strong>Analytics Cookies:</strong> These cookies allow us to
              count visits and traffic sources so we can measure and improve the
              performance of our site.
            </li>
            <li>
              <strong>Functional Cookies:</strong> These cookies enable the
              website to provide enhanced functionality and personalization.
            </li>
            <li>
              <strong>Advertising Cookies:</strong> These cookies may be set
              through our site by our advertising partners.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Managing Cookies
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            You can control and/or delete cookies as you wish. You can delete
            all cookies that are already on your computer and you can set most
            browsers to prevent them from being placed. However, if you do this,
            you may have to manually adjust some preferences every time you
            visit a site and some services and functionalities may not work.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Third-Party Cookies
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            In some special cases we also use cookies provided by trusted third
            parties. The following section details which third party cookies you
            might encounter through this site.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            If you have any questions about our use of cookies or other
            technologies, please contact us through our contact page.
          </p>

          <p className="text-gray-700 dark:text-gray-300 mt-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
