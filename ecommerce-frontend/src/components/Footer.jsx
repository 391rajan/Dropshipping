import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom"; // Import Link for internal routing

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
  <footer className="bg-accent text-background py-12 mt-16 md:mt-24"> {/* Modern accent background, more vertical padding */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8"> {/* Adjusted max-width and gaps */}

        {/* 1. Quick Links */}
        <div>
          <h4 className="font-bold text-lg mb-4 text-white">Quick Links</h4> {/* Stronger heading */}
          <ul className="space-y-3 text-sm"> {/* More vertical space */}
            <li><Link to="/" className="hover:text-white transition-colors duration-200">Home</Link></li>
            <li><Link to="/shop" className="hover:text-white transition-colors duration-200">Shop All</Link></li>
            <li><Link to="/categories" className="hover:text-white transition-colors duration-200">Categories</Link></li>
            <li><Link to="/track" className="hover:text-white transition-colors duration-200">Track Order</Link></li> {/* Added from navbar */}
            <li><Link to="/about" className="hover:text-white transition-colors duration-200">About Us</Link></li> {/* Added from navbar */}
            <li><Link to="/contact" className="hover:text-white transition-colors duration-200">Contact</Link></li>
          </ul>
        </div>

        {/* 2. Policies */}
        <div>
          <h4 className="font-bold text-lg mb-4 text-white">Policies</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/privacy-policy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link></li> {/* Consistent slug */}
            <li><Link to="/terms-of-service" className="hover:text-white transition-colors duration-200">Terms of Service</Link></li> {/* Consistent slug */}
            <li><Link to="/refund-policy" className="hover:text-white transition-colors duration-200">Refund Policy</Link></li> {/* Standard terminology */}
            <li><Link to="/shipping-policy" className="hover:text-white transition-colors duration-200">Shipping Policy</Link></li> {/* Often a separate policy */}
          </ul>
        </div>

        {/* 3. Customer Support */}
        <div>
          <h4 className="font-bold text-lg mb-4 text-white">Customer Support</h4> {/* Renamed from Help to Support */}
          <ul className="space-y-3 text-sm">
            <li><Link to="/faqs" className="hover:text-white transition-colors duration-200">FAQs</Link></li> {/* Consistent slug */}
            <li><Link to="/shipping-info" className="hover:text-white transition-colors duration-200">Shipping & Delivery</Link></li> {/* More user-friendly */}
            <li><Link to="/returns-exchanges" className="hover:text-white transition-colors duration-200">Returns & Exchanges</Link></li> {/* Common specific policy */}
            <li><Link to="/contact" className="hover:text-white transition-colors duration-200">Contact Us</Link></li> {/* Added a direct link to contact */}
          </ul>
        </div>

        {/* 4. Contact Info & Social */}
        <div>
          <h4 className="font-bold text-lg mb-4 text-white">Get in Touch</h4> {/* More engaging heading */}
          <div className="space-y-2 text-sm">
            <p>Email: <a href="mailto:support@dropshipping.com" className="hover:underline hover:text-white transition-colors duration-200">support@dropshipping.com</a></p>
            <p>Phone: <a href="tel:+919876543210" className="hover:underline hover:text-white transition-colors duration-200">+91 98765 43210</a></p>
            {/* You could add an address here if you have one */}
            {/* <p className="mt-4">123 Main Street, City, State, ZIP</p> */}
          </div>
          
          <div className="flex gap-4 mt-5"> {/* Increased top margin for social icons */}
            <a href="https://www.instagram.com/your_dropshipping_store" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors duration-200">
              <Instagram size={24} /> {/* Increased icon size */}
            </a>
            <a href="https://twitter.com/your_dropshipping_store" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors duration-200">
              <Twitter size={24} />
            </a>
            <a href="https://www.facebook.com/your_dropshipping_store" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors duration-200">
              <Facebook size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-700 mt-12 mb-8 max-w-7xl mx-auto px-6 md:px-8" /> {/* Subtle divider */}

      {/* Payment & Copyright */}
      <div className="mt-8 text-center text-sm text-gray-400"> {/* Adjusted text color */}
        <p className="mb-4 flex justify-center items-center flex-wrap gap-x-4 gap-y-2"> {/* Added flex and gap for payment icons */}
          <span className="mr-2">We accept:</span>
          {/* Replace with actual SVG or image components for payment logos */}
          <img src="/payment-icons/visa.svg" alt="Visa" className="h-5" />
          <img src="/payment-icons/mastercard.svg" alt="MasterCard" className="h-5" />
          <img src="/payment-icons/paypal.svg" alt="PayPal" className="h-5" />
          <img src="/payment-icons/upi.svg" alt="UPI" className="h-5" /> {/* Assuming you have a UPI icon */}
          {/* Add more as needed */}
        </p>
        <p>&copy; {currentYear} Your Dropshipping Store. All rights reserved.</p> {/* Changed "Dropshipping" to "Your Dropshipping Store" */}
      </div>
    </footer>
  );
}

export default Footer;