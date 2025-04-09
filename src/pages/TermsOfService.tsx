import { useLanguage } from "@/contexts/LanguageContext";

export const TermsOfService = () => {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-6">
        Terms of Service
      </h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using Agri Assist, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p className="mb-4">
            Permission is granted to temporarily access the materials (information or software) on Agri Assist's website for personal, non-commercial transitory viewing only.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
          <p className="mb-4">
            The materials on Agri Assist's website are provided on an 'as is' basis. Agri Assist makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
          <p className="mb-4">
            In no event shall Agri Assist or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Agri Assist's website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Revisions and Errata</h2>
          <p className="mb-4">
            The materials appearing on Agri Assist's website could include technical, typographical, or photographic errors. Agri Assist does not warrant that any of the materials on its website are accurate, complete, or current.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Contact Information</h2>
          <p className="mb-4">
            For any questions regarding these Terms of Service, please contact us at:
          </p>
          <ul className="list-disc pl-6">
            <li>Email: support@agriassist.com</li>
            <li>Phone: 1800-180-1551</li>
            <li>Address: Department of Agriculture, Government of Telangana, Secretariat, Hyderabad, Telangana, India</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService; 