import React from "react";

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-6 sm:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Terms of Service
        </h1>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Welcome to Baby Sneakers. These Terms of Service govern your use of
            our website and services. By accessing or using our services, you
            agree to be bound by these terms.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Use of Our Services
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            You may use our services only for lawful purposes and in accordance
            with these Terms. You agree not to use our services in any way that
            violates any applicable laws or regulations.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Account Registration
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            To access certain features of our services, you may be required to
            register for an account. You are responsible for maintaining the
            confidentiality of your account information and for all activities
            that occur under your account.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Orders and Payment
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            All orders are subject to acceptance and availability. Prices are
            subject to change without notice. Payment must be made in full at
            the time of purchase. We reserve the right to refuse or cancel any
            order for any reason.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Shipping and Returns
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We will make reasonable efforts to deliver your order within the
            estimated timeframe. If you are not satisfied with your purchase,
            you may return it within 30 days of receipt for a full refund,
            subject to our return policy.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Intellectual Property
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            All content on our website, including text, graphics, logos, and
            images, is the property of Baby Sneakers or our licensors and is
            protected by copyright and other intellectual property laws.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Limitation of Liability
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            In no event shall Baby Sneakers be liable for any indirect,
            incidental, special, or consequential damages arising out of or in
            connection with your use of our services.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Changes to Terms
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We reserve the right to modify these Terms at any time. Any changes
            will be effective immediately upon posting on our website. Your
            continued use of our services after any such changes constitutes
            your acceptance of the new Terms.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            If you have any questions about these Terms, please contact us
            through our contact page.
          </p>

          <p className="text-gray-700 dark:text-gray-300 mt-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
