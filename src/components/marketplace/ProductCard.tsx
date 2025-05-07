
import { useState } from 'react';
import { Calendar, MapPin, ArrowUp, ArrowDown, Truck, AlertCircle } from 'lucide-react';
import ButtonWithIcon from '@/components/ui/button-with-icon';
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { bidSchema } from '@/lib/validations/schema';
import { toast as sonnerToast } from 'sonner';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useSupabase } from '@/lib/supabase/supabase-provider';

interface FarmerType {
  name: string;
  image: string;
  rating: number;
  id?: string; // Add optional id property
}

interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  description: string;
  basePrice: number;
  unit: string;
  quantity: number;
  location: string;
  harvestDate: string;
  farmer: FarmerType;
  isLoading?: boolean;
  imageLazyLoad?: boolean;
}

const ProductCard = ({
  id,
  image,
  title,
  description,
  basePrice,
  unit,
  quantity,
  location,
  harvestDate,
  farmer,
  isLoading = false,
  imageLazyLoad = false
}: ProductCardProps) => {
  const { toast } = useToast();
  const [bidAmount, setBidAmount] = useState(basePrice);
  const [showBidForm, setShowBidForm] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(!imageLazyLoad);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bidError, setBidError] = useState<string | null>(null);
  const { supabase, user } = useSupabase();
  
  const validateBid = (amount: number) => {
    try {
      bidSchema.parse({
        productId: id,
        bidAmount: amount,
        userId: user?.id,
      });
      return true;
    } catch (error: any) {
      const formattedError = error.errors?.[0]?.message || "Invalid bid amount";
      setBidError(formattedError);
      return false;
    }
  };
  
  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBidError(null);
    
    if (!validateBid(bidAmount)) {
      return;
    }
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to place a bid.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check for bid conflicts (another user bidding at the same time)
      const { data: latestBid, error: fetchError } = await supabase
        .from('bids')
        .select('amount')
        .eq('product_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw new Error("Couldn't verify latest bid");
      }
      
      if (latestBid && latestBid.amount >= bidAmount) {
        setBidError(`Your bid must be higher than the current bid of $${latestBid.amount.toFixed(2)}`);
        setIsSubmitting(false);
        return;
      }
      
      // Submit bid to database
      const { error: insertError } = await supabase.from('bids').insert({
        product_id: id,
        user_id: user.id,
        amount: bidAmount,
        status: 'pending' // Will be processed by fraud detection
      });
      
      if (insertError) throw new Error(insertError.message);
      
      // Submit notification to farmer
      // Use a fallback ID if farmer.id is not available
      const farmerId = farmer.id || 'farmer-123';
      await supabase.from('notifications').insert({
        user_id: farmerId,
        type: 'bid',
        title: 'New Bid Received',
        message: `A new bid of $${bidAmount.toFixed(2)} was placed on your product: ${title}`,
        reference_id: id,
        read: false
      });
      
      toast({
        title: "Bid submitted!",
        description: `Your bid of $${bidAmount.toFixed(2)} per ${unit} has been sent to the farmer.`,
      });
      setShowBidForm(false);
      
      // Show success toast with Sonner
      sonnerToast.success("Bid submitted successfully!", {
        description: "You will be notified when the farmer responds.",
      });
    } catch (error: any) {
      console.error("Bid submission error:", error);
      setBidError(error.message || "Failed to submit bid. Please try again.");
      
      // Show error toast with Sonner
      sonnerToast.error("Bid submission failed", {
        description: error.message || "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const increaseBid = () => {
    setBidAmount(prev => +(prev + 0.5).toFixed(2));
    setBidError(null);
  };
  
  const decreaseBid = () => {
    if (bidAmount > basePrice) {
      setBidAmount(prev => +(prev - 0.5).toFixed(2));
      setBidError(null);
    }
  };
  
  // Ensure we get the correct image path
  const imageSrc = image;
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm h-[600px]">
        <div className="relative h-48">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-1/4" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex items-center">
            <Skeleton className="h-4 w-1/3 mr-2" />
          </div>
          <div className="flex items-center">
            <Skeleton className="h-4 w-1/2 mr-2" />
          </div>
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Skeleton className="h-8 w-8 rounded-full mr-2" />
                <div>
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
          <div className="flex justify-between gap-2 pt-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-10 w-1/2" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow card-hover">
      <div className="relative h-48">
        {!imageLoaded && <Skeleton className="w-full h-full absolute inset-0" />}
        <img 
          src={imageSrc} 
          alt={title}
          className={`w-full h-full object-cover ${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          loading={imageLazyLoad ? "lazy" : "eager"}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute top-3 left-3 bg-marketash-green text-white px-2 py-1 rounded text-sm font-medium">
          {quantity} {unit} available
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold">{title}</h3>
          <div className="text-marketash-blue font-bold">${basePrice.toFixed(2)}/{unit}</div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="h-4 w-4 mr-1" aria-hidden="true" />
          <span>{location}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Calendar className="h-4 w-4 mr-1" aria-hidden="true" />
          <span>Harvested: {harvestDate}</span>
        </div>
        
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mb-4">
          <div className="flex items-center">
            <img 
              src={farmer.image}
              alt={farmer.name}
              className="h-8 w-8 rounded-full mr-2 object-cover"
              loading="lazy"
            />
            <div>
              <div className="text-sm font-medium">{farmer.name}</div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-xs ${i < farmer.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center text-xs bg-marketash-lightBlue text-marketash-blue px-2 py-1 rounded-full">
            <Truck className="h-3 w-3 mr-1" aria-hidden="true" />
            <span>Delivery available</span>
          </div>
        </div>
        
        {bidError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{bidError}</AlertDescription>
          </Alert>
        )}
        
        {!showBidForm ? (
          <div className="flex justify-between gap-2">
            <ButtonWithIcon 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowBidForm(true)}
              aria-label="Place bid on this product"
            >
              Place Bid
            </ButtonWithIcon>
            <ButtonWithIcon 
              variant="primary" 
              className="flex-1"
              onClick={() => {
                toast({
                  title: "Coming soon!",
                  description: "This feature is under development.",
                });
              }}
              aria-label="Contact the farmer about this product"
            >
              Contact Farmer
            </ButtonWithIcon>
          </div>
        ) : (
          <form onSubmit={handleBidSubmit} className="space-y-3">
            <div className="text-sm font-medium mb-1">Enter your bid price per {unit}:</div>
            <div className="flex items-center">
              <span className="bg-gray-100 px-3 py-2 rounded-l-md border border-r-0 border-gray-300">$</span>
              <input
                type="text"
                value={bidAmount.toFixed(2)}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value >= basePrice) {
                    setBidAmount(value);
                    setBidError(null);
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-marketash-blue"
                aria-label={`Bid amount in dollars per ${unit}`}
              />
              <div className="flex flex-col border border-l-0 border-gray-300 rounded-r-md overflow-hidden">
                <button
                  type="button"
                  onClick={increaseBid}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 border-b border-gray-300"
                  aria-label="Increase bid amount"
                >
                  <ArrowUp className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={decreaseBid}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                  aria-label="Decrease bid amount"
                >
                  <ArrowDown className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowBidForm(false);
                  setBidError(null);
                }}
                className="flex-1 bg-gray-100 text-gray-700 font-medium rounded-md px-4 py-2 hover:bg-gray-200"
                aria-label="Cancel bidding"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-marketash-blue text-white font-medium rounded-md px-4 py-2 hover:bg-marketash-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Submit your bid"
              >
                {isSubmitting ? "Submitting..." : "Submit Bid"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
