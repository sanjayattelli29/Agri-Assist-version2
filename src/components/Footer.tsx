
import { Github, ShieldAlert, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t mt-auto">
      <div className="container flex flex-col space-y-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {year} AgroPredict. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <Link
              to="/admin/login"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ShieldAlert className="h-5 w-5" />
              <span className="text-sm">Admin</span>
            </Link>
          </div>
        </div>
        
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          Developed with <Heart className="h-4 w-4 mx-1 text-red-500 fill-red-500" /> by{" "}
          <a 
            href="https://designwithsanjay.netlify.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-1 font-medium hover:text-primary hover:underline transition-colors"
          >
            designwithsanjay
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
