
import { ArrowRight } from 'lucide-react';
import ButtonWithIcon from '@/components/ui/button-with-icon';
import { Link } from 'react-router-dom';

const steps = [
  {
    number: "01",
    title: "Register Your Farm",
    description: "Sign up as a farmer with basic information about your farm, crops, and location.",
    imageSrc: "/lovable-uploads/marketash-user%20process.png",
    imageAlt: "Farmer registration"
  },
  {
    number: "02",
    title: "List Your Produce",
    description: "Add details about your harvests, including quantity, quality, and your desired base price.",
    imageSrc: "/lovable-uploads/new%20marketash%20logo.png",
    imageAlt: "Listing produce"
  },
  {
    number: "03",
    title: "Receive & Accept Bids",
    description: "Get competitive bids from verified buyers and choose the best offer for your produce.",
    imageSrc: "/lovable-uploads/marketash%20bid%20accepted.png",
    imageAlt: "Accepting bids"
  },
  {
    number: "04",
    title: "Delivery & Payment",
    description: "Arrange delivery through our logistics partners and receive secure payment upon confirmation.",
    imageSrc: "/lovable-uploads/Marketash%20Logistics.png",
    imageAlt: "Delivery and payment"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-marketash-gray">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-marketash-blue mb-6">
            How Marketash Works
          </h2>
          <p className="text-lg text-gray-700">
            Our streamlined process connects farmers directly to buyers, 
            removing middlemen and maximizing profits for producers.
          </p>
        </div>
        
        <div className="space-y-16">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
                index % 2 !== 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className={`${index % 2 !== 0 ? 'md:order-2' : ''}`}>
                <div className="space-y-6 max-w-lg">
                  <div className="inline-block py-1 px-3 bg-marketash-blue/10 rounded-full text-marketash-blue font-semibold text-sm">
                    Step {step.number}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold">{step.title}</h3>
                  <p className="text-gray-700 text-lg">{step.description}</p>
                </div>
              </div>
              <div className={`${index % 2 !== 0 ? 'md:order-1' : ''}`}>
                <img
                  src="/lovable-uploads/new%20marketash%20logo.png"
                  alt="Logo Image"
                  className="rounded-lg shadow-lg w-full object-cover h-[300px]"
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Link to="/marketplace">
            <ButtonWithIcon 
              variant="primary" 
              icon={ArrowRight} 
              iconPosition="right"
              className="text-lg px-8 py-4"
            >
              Start Using Marketash
            </ButtonWithIcon>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
