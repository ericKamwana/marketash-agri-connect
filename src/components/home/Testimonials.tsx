
const testimonials = [
  {
    quote: "Since joining Marketash, I've been able to sell my cassava at prices 30% higher than what local middlemen offered.",
    name: "Sarah Mwangi",
    role: "Cassava Farmer, Kenya",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=150&auto=format&fit=crop"
  },
  {
    quote: "The AI Crop Doctor helped me identify a fungal infection early, saving my entire tomato harvest this season.",
    name: "John Okafor",
    role: "Tomato Farmer, Nigeria",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
  },
  {
    quote: "As a restaurant owner, I love sourcing directly from farmers. The quality is better and I know I'm paying them fairly.",
    name: "Amina Diop",
    role: "Restaurant Owner, Senegal",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=150&auto=format&fit=crop"
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-marketash-blue mb-6">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-700">
            Hear from farmers and buyers who have transformed their businesses through Marketash.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-6 md:p-8 rounded-lg border border-gray-100 shadow-sm"
            >
              <div className="flex items-center mb-2">
                <div className="text-marketash-green">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="inline-block">★</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 p-8 bg-marketash-blue text-white rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="text-center md:text-left md:col-span-2">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">Ready to grow your agribusiness?</h3>
              <p className="text-blue-100">Join thousands of farmers and buyers already using Marketash.</p>
            </div>
            <div className="text-center md:text-right">
              <a 
                href="/auth?type=register" 
                className="inline-block bg-white text-marketash-blue font-medium rounded-md px-6 py-3 hover:bg-gray-100 transition-colors"
              >
                Get Started Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
