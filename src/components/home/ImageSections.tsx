
import { Link } from 'react-router-dom';
import ButtonWithIcon from '@/components/ui/button-with-icon';

const ImageSections = () => {
  return (
    <section className="py-16 md:py-24 bg-marketash-gray">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-marketash-blue mb-12">
          Empowering African Farmers in Every Step
        </h2>
        
        {/* Logistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl md:text-3xl font-bold text-marketash-blue mb-4">
              Fast and Reliable Logistics
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              Our verified delivery partners ensure your produce reaches buyers quickly and safely. 
              Track your deliveries in real-time and receive instant notifications.
            </p>
            <Link to="/marketplace">
              <ButtonWithIcon variant="secondary" className="mt-4">
                Explore Logistics Network
              </ButtonWithIcon>
            </Link>
          </div>
          <div className="order-1 md:order-2">
            <img 
              src="public/lovable-uploads/Marketash Logistics.png" 
              alt="Marketash Logistics" 
              className="rounded-lg shadow-xl w-full"
            />
          </div>
        </div>
        
        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <img 
              src="public/lovable-uploads/Market Analytics Dashboard.png" 
              alt="Market Analytics Dashboard" 
              className="rounded-lg shadow-xl w-full"
            />
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-marketash-blue mb-4">
              Data-Driven Market Insights
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              Access powerful analytics to understand market trends, buyer preferences, 
              and optimize your pricing strategy for maximum profitability.
            </p>
            <Link to="/dashboard">
              <ButtonWithIcon variant="secondary" className="mt-4">
                View Dashboard Demo
              </ButtonWithIcon>
            </Link>
          </div>
        </div>
        
        {/* Financing Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl md:text-3xl font-bold text-marketash-blue mb-4">
              Flexible Financing Options
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              Access affordable inputs with our Buy Now Pay Later options. 
              Pay just 25% upfront and settle the balance after harvest, 
              helping you manage your cash flow effectively.
            </p>
            <Link to="/auth?type=register">
              <ButtonWithIcon variant="secondary" className="mt-4">
                Apply for Financing
              </ButtonWithIcon>
            </Link>
          </div>
          <div className="order-1 md:order-2">
            <img 
              src="public/lovable-uploads/Marketash Financing.png" 
              alt="Marketash Financing" 
              className="rounded-lg shadow-xl w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageSections;
