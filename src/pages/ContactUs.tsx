import { useLanguage } from "@/contexts/LanguageContext";

export const ContactUs = () => {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-6">
        Contact Us
      </h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Kisan Call Centre (KCC)</h2>
          <p className="mb-4">
            For comprehensive agricultural assistance across India, farmers can utilize the nationwide Kisan Call Centre service:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Toll-free number: <strong>1800-180-1551</strong></li>
            <li>Support available in 22 local languages</li>
            <li>Operating hours: 6:00 AM to 10:00 PM daily</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Department of Agriculture, Telangana</h2>
          <p className="mb-4">
            For localized support in Telangana:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Address: Department of Agriculture, Government of Telangana, Secretariat, Hyderabad, Telangana, India</li>
            <li>Phone: 040-23450731</li>
            <li>Email: agri-info@telangana.gov.in</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">District Agriculture Officers (DAO)</h2>
          <p className="mb-4">
            For district-specific assistance, please contact your local District Agriculture Officer at the district headquarters. Contact information is available on the State Department of Agriculture's official website or at the nearest agricultural office.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Krishi Vigyan Kendras (KVKs)</h2>
          <p className="mb-4">
            For district-level agricultural extension support:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Visit the <a href="https://kvk.icar.gov.in/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">ICAR KVK portal</a> to find your nearest KVK</li>
            <li>KVKs provide tailored support and training programs</li>
            <li>Access to agricultural experts and resources</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Online Support</h2>
          <p className="mb-4">
            For online assistance:
          </p>
          <ul className="list-disc pl-6">
            <li>Email: support@agriassist.com</li>
            <li>WhatsApp: +91 9599780225</li>
            <li>Live Chat: Available on our website during business hours</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ContactUs; 