import { useLanguage } from "@/contexts/LanguageContext";

export const AboutUs = () => {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-6">
        About Agri Assist
      </h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="mb-4">
            Agri Assist is dedicated to empowering Indian farmers with cutting-edge technology and expert knowledge. Our mission is to bridge the gap between traditional farming practices and modern agricultural innovations, ensuring sustainable and profitable farming for all.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
          <p className="mb-4">
            We provide comprehensive agricultural support through:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>AI-powered crop prediction and recommendations</li>
            <li>Real-time weather and soil monitoring</li>
            <li>Expert agricultural advice and consultation</li>
            <li>Access to government schemes and subsidies</li>
            <li>Market price tracking and analysis</li>
            <li>Pest and disease management solutions</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
          <p className="mb-4">
            Our team consists of:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Agricultural experts with decades of field experience</li>
            <li>Data scientists specializing in agricultural analytics</li>
            <li>Software engineers developing cutting-edge solutions</li>
            <li>Field agents providing on-ground support</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Partnerships</h2>
          <p className="mb-4">
            We collaborate with:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Indian Council of Agricultural Research (ICAR)</li>
            <li>State Agricultural Departments</li>
            <li>Krishi Vigyan Kendras (KVKs)</li>
            <li>Agricultural Universities</li>
            <li>Leading Agricultural Research Institutions</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p className="mb-4">
            For more information about our services, please contact:
          </p>
          <ul className="list-disc pl-6">
            <li>Email: info@agriassist.com</li>
            <li>Phone: 1800-180-1551</li>
            <li>Address: Department of Agriculture, Government of Telangana, Secretariat, Hyderabad, Telangana, India</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AboutUs; 