
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ButtonWithIcon from '@/components/ui/button-with-icon';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-marketash-lightBlue to-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-marketash-blue mb-6">
              Connecting African Farmers to Global Markets
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Marketash is an AI-powered agritech marketplace that empowers farmers with technology, fair prices, and financial tools to grow their business sustainably.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/marketplace">
                <ButtonWithIcon 
                  variant="primary" 
                  icon={ArrowRight} 
                  iconPosition="right"
                  className="text-lg px-8 py-4"
                >
                  Explore Marketplace
                </ButtonWithIcon>
              </Link>
              <Link to="/auth?type=register">
                <ButtonWithIcon 
                  variant="outline" 
                  className="text-lg px-8 py-4"
                >
                  Register as Farmer
                </ButtonWithIcon>
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6">
              <div className="flex items-center">
                <div className="bg-marketash-green rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="ml-2 font-medium">30% Income Increase</span>
              </div>
              <div className="flex items-center">
                <div className="bg-marketash-green rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="ml-2 font-medium">95% Bid Fulfillment</span>
              </div>
            </div>
          </div>
          <div className="relative h-full flex justify-center">
            <img
              src="/lovable-uploads/African%20Farmers%20with%20Mobile%20App.png"
              alt="African Farmers with Mobile App"
              className="rounded-lg shadow-xl max-h-[500px] object-cover animate-fade-in"
            />
            <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-4 w-48 animate-fade-in">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-800">Weekly Sales</span>
                <span className="text-marketash-green font-bold">+24%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-marketash-green rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Shapes */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[300px] h-[300px] rounded-full bg-marketash-green/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-marketash-blue/10 blur-3xl"></div>
    </div>
  );
};

export default Hero;
