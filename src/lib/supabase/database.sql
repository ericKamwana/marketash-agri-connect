
-- Create users table with additional profile fields
CREATE TABLE public.users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT,
  location TEXT,
  credit_score INTEGER DEFAULT 500,
  user_type TEXT NOT NULL CHECK (user_type IN ('farmer', 'buyer', 'admin')),
  rating FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create row level security policies
CREATE POLICY "Users can read all user profiles" 
  ON public.users FOR SELECT 
  USING (true);
  
CREATE POLICY "Users can update their own profiles" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);

-- Create products table
CREATE TABLE public.products (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  base_price DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  location TEXT NOT NULL,
  harvest_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  category TEXT NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'withdrawn')),
  farmer_id UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create row level security policies
CREATE POLICY "Anyone can read products" 
  ON public.products FOR SELECT 
  USING (true);
  
CREATE POLICY "Farmers can create their products" 
  ON public.products FOR INSERT 
  USING (auth.uid() = farmer_id);
  
CREATE POLICY "Farmers can update their products" 
  ON public.products FOR UPDATE 
  USING (auth.uid() = farmer_id);
  
CREATE POLICY "Farmers can delete their products" 
  ON public.products FOR DELETE 
  USING (auth.uid() = farmer_id);

-- Create product_bids table
CREATE TABLE public.product_bids (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  bidder_id UUID REFERENCES public.users(id) NOT NULL,
  bid_amount DECIMAL NOT NULL,
  quantity INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE public.product_bids ENABLE ROW LEVEL SECURITY;

-- Create row level security policies
CREATE POLICY "Users can read all bids" 
  ON public.product_bids FOR SELECT 
  USING (true);
  
CREATE POLICY "Buyers can create bids" 
  ON public.product_bids FOR INSERT 
  USING (auth.uid() = bidder_id);
  
CREATE POLICY "Users can update their own bids" 
  ON public.product_bids FOR UPDATE 
  USING (auth.uid() = bidder_id OR 
         auth.uid() IN (
           SELECT farmer_id FROM public.products WHERE id = product_id
         ));

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  bid_id UUID REFERENCES public.product_bids(id),
  buyer_id UUID REFERENCES public.users(id) NOT NULL,
  seller_id UUID REFERENCES public.users(id) NOT NULL,
  amount DECIMAL NOT NULL,
  quantity INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'in_transit', 'completed', 'cancelled', 'disputed')),
  payment_method TEXT,
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create row level security policies
CREATE POLICY "Users can see transactions they are involved in" 
  ON public.transactions FOR SELECT 
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
  
CREATE POLICY "System can create transactions" 
  ON public.transactions FOR INSERT 
  WITH CHECK (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Create crop_diagnosis table
CREATE TABLE public.crop_diagnosis (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  image_url TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  diagnosis TEXT,
  confidence_score FLOAT,
  recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE public.crop_diagnosis ENABLE ROW LEVEL SECURITY;

-- Create row level security policies
CREATE POLICY "Users can see their own diagnoses" 
  ON public.crop_diagnosis FOR SELECT 
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can create their own diagnoses" 
  ON public.crop_diagnosis FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create loans table
CREATE TABLE public.loans (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  amount DECIMAL NOT NULL,
  interest_rate DECIMAL NOT NULL,
  term_months INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'paid', 'defaulted')),
  purpose TEXT NOT NULL,
  collateral TEXT,
  approval_score INTEGER,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;

-- Create row level security policies
CREATE POLICY "Users can see their own loans" 
  ON public.loans FOR SELECT 
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can create loan applications" 
  ON public.loans FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create loan_payments table
CREATE TABLE public.loan_payments (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  loan_id UUID REFERENCES public.loans(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  payment_method TEXT,
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE public.loan_payments ENABLE ROW LEVEL SECURITY;

-- Create row level security policies
CREATE POLICY "Users can see their own loan payments" 
  ON public.loan_payments FOR SELECT 
  USING (auth.uid() IN (
    SELECT user_id FROM public.loans WHERE id = loan_id
  ));

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create row level security policies
CREATE POLICY "Users can see their own notifications" 
  ON public.notifications FOR SELECT 
  USING (auth.uid() = user_id);

-- Create a function to handle real-time notifications for bids
CREATE OR REPLACE FUNCTION handle_new_bid()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a notification for the product owner
  INSERT INTO public.notifications (user_id, title, message, type, data)
  SELECT 
    products.farmer_id,
    'New bid received',
    'You have received a new bid on your product: ' || products.title,
    'bid',
    json_build_object(
      'product_id', NEW.product_id,
      'bid_id', NEW.id,
      'bid_amount', NEW.bid_amount
    )
  FROM public.products
  WHERE products.id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger for new bids
CREATE TRIGGER on_new_bid
  AFTER INSERT ON public.product_bids
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_bid();

-- Function to handle bid status changes
CREATE OR REPLACE FUNCTION handle_bid_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status <> OLD.status THEN
    -- If bid was accepted
    IF NEW.status = 'accepted' THEN
      -- Create a notification for the bidder
      INSERT INTO public.notifications (user_id, title, message, type, data)
      SELECT 
        NEW.bidder_id,
        'Bid accepted',
        'Your bid has been accepted for product: ' || products.title,
        'bid_accepted',
        json_build_object(
          'product_id', NEW.product_id,
          'bid_id', NEW.id
        )
      FROM public.products
      WHERE products.id = NEW.product_id;
      
      -- Create a transaction
      INSERT INTO public.transactions (
        product_id, 
        bid_id, 
        buyer_id, 
        seller_id, 
        amount, 
        quantity, 
        status
      )
      SELECT 
        NEW.product_id,
        NEW.id,
        NEW.bidder_id,
        products.farmer_id,
        NEW.bid_amount * NEW.quantity,
        NEW.quantity,
        'processing'
      FROM public.products
      WHERE products.id = NEW.product_id;
      
      -- Update product status if all quantity is sold
      UPDATE public.products
      SET 
        quantity = CASE 
          WHEN quantity - NEW.quantity <= 0 THEN 0
          ELSE quantity - NEW.quantity
        END,
        status = CASE 
          WHEN quantity - NEW.quantity <= 0 THEN 'sold'
          ELSE status
        END
      WHERE id = NEW.product_id;
      
      -- Reject all other pending bids if product is now sold out
      UPDATE public.product_bids
      SET status = 'rejected'
      WHERE 
        product_id = NEW.product_id AND 
        id <> NEW.id AND 
        status = 'pending' AND
        EXISTS (
          SELECT 1 FROM public.products 
          WHERE id = NEW.product_id AND (quantity = 0 OR status = 'sold')
        );
    
    -- If bid was rejected
    ELSIF NEW.status = 'rejected' THEN
      -- Create a notification for the bidder
      INSERT INTO public.notifications (user_id, title, message, type, data)
      SELECT 
        NEW.bidder_id,
        'Bid rejected',
        'Your bid was rejected for product: ' || products.title,
        'bid_rejected',
        json_build_object(
          'product_id', NEW.product_id,
          'bid_id', NEW.id
        )
      FROM public.products
      WHERE products.id = NEW.product_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger for bid status changes
CREATE TRIGGER on_bid_status_change
  AFTER UPDATE ON public.product_bids
  FOR EACH ROW
  EXECUTE FUNCTION handle_bid_status_change();

-- Create a function to automatically process loan applications
CREATE OR REPLACE FUNCTION process_loan_application()
RETURNS TRIGGER AS $$
DECLARE
  user_score INTEGER;
BEGIN
  -- Get the user's credit score
  SELECT credit_score INTO user_score
  FROM public.users
  WHERE id = NEW.user_id;
  
  -- Calculate approval score (simplified algorithm)
  NEW.approval_score := LEAST(1000, user_score + 
    CASE 
      WHEN NEW.amount < 1000 THEN 100
      WHEN NEW.amount < 5000 THEN 50
      WHEN NEW.amount < 10000 THEN 25
      ELSE 0
    END
  );
  
  -- Auto-approve loans for high credit scores
  IF NEW.approval_score >= 700 THEN
    NEW.status := 'approved';
    NEW.approved_at := NOW();
    
    -- Create notification for approval
    INSERT INTO public.notifications (
      user_id, 
      title, 
      message, 
      type, 
      data
    )
    VALUES (
      NEW.user_id,
      'Loan Approved',
      'Your loan application for $' || NEW.amount || ' has been automatically approved.',
      'loan_approved',
      json_build_object(
        'loan_id', NEW.id,
        'amount', NEW.amount
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to process loan applications
CREATE TRIGGER on_loan_application
  BEFORE INSERT ON public.loans
  FOR EACH ROW
  EXECUTE FUNCTION process_loan_application();

-- Create a function to adjust user credit scores based on successful transactions
CREATE OR REPLACE FUNCTION update_credit_score_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status <> 'completed' THEN
    -- Increase buyer's credit score
    UPDATE public.users
    SET credit_score = LEAST(1000, credit_score + 5)
    WHERE id = NEW.buyer_id;
    
    -- Increase seller's credit score
    UPDATE public.users
    SET credit_score = LEAST(1000, credit_score + 5)
    WHERE id = NEW.seller_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to update credit scores on successful transactions
CREATE TRIGGER on_transaction_complete
  AFTER UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_credit_score_on_transaction();
