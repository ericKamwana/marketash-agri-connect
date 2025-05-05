
import { Shield, Truck, Coins, Database } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'AI Crop Doctor',
    description: 'Upload images of your crops for instant disease diagnosis and treatment recommendations.'
  },
  {
    icon: Coins,
    title: 'Microloans',
    description: 'Access quick, affordable capital based on your transaction history and score.'
  },
  {
    icon: Database,
    title: 'Smart Bidding System',
    description: 'Get AI-recommended fair prices based on historical market data and current trends.'
  },
  {
    icon: Truck,
    title: 'Logistics Integration',
    description: 'Connect with verified delivery partners for reliable transportation of your produce.'
  }
];

const Features = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-marketash-blue mb-6">
            How Marketash Empowers Farmers
          </h2>
          <p className="text-lg text-gray-700">
            Our platform leverages cutting-edge technology to solve common challenges 
            faced by African farmers and connects them directly to buyers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center p-3 bg-marketash-lightGreen rounded-lg mb-4">
                <feature.icon className="h-6 w-6 text-marketash-green" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
