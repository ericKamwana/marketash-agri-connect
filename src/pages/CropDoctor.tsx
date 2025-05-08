
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Camera, Upload, X, ArrowRight, Check } from 'lucide-react';
import { useCropDiagnosis } from '@/lib/supabase/useCropDiagnosis';
import { useSupabase } from '@/lib/supabase/supabase-provider';
import { useNavigate } from 'react-router-dom';

const CropDoctor = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [cropType, setCropType] = useState<string>('tomato');
  const { useDiagnoseCropMutation } = useCropDiagnosis();
  const { mutate: diagnoseCrop, isPending: isAnalyzing } = useDiagnoseCropMutation();
  const [result, setResult] = useState<any | null>(null);
  const { user } = useSupabase();
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast("Invalid file type. Please upload an image file.", {
          description: "Only image files are supported.",
          variant: "destructive",
        });
      }
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
  };

  const analyzeImage = () => {
    // Check if user is logged in
    if (!user) {
      toast("Authentication Required", {
        description: "Please log in to use the Crop Doctor feature.",
        action: {
          label: "Login",
          onClick: () => navigate('/auth'),
        },
      });
      return;
    }

    if (!selectedFile) return;
    
    diagnoseCrop(
      { image: selectedFile, cropType }, 
      {
        onSuccess: (data) => {
          // Transform the diagnosis data to match the UI format
          setResult({
            disease: data.diagnosis,
            confidence: Math.round(data.confidence_score * 100),
            description: "A fungal disease that affects various plants, causing brown spots on leaves that eventually turn the entire leaf brown.",
            treatment: data.recommendation.split('. ').filter(item => item.trim() !== ''),
            prevention: [
              "Use disease-resistant varieties",
              "Practice crop rotation",
              "Water at the base of plants instead of overhead",
              "Apply preventative fungicide treatments during wet seasons"
            ]
          });
        }
      }
    );
  };

  const cropTypes = [
    { value: 'tomato', label: 'Tomato' },
    { value: 'potato', label: 'Potato' },
    { value: 'corn', label: 'Corn' },
    { value: 'rice', label: 'Rice' },
    { value: 'wheat', label: 'Wheat' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-marketash-gray py-10">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="bg-marketash-blue rounded-lg p-6 md:p-10 mb-8 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">AI Crop Doctor</h1>
                <p className="text-blue-100 mb-6">
                  Upload images of your crops to instantly diagnose diseases and get recommended treatments.
                  Our AI model can identify common crop diseases with high accuracy.
                </p>
              </div>
              <div className="hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=800&auto=format&fit=crop" 
                  alt="Crop Disease" 
                  className="rounded-lg h-48 w-full object-cover"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Upload Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Upload a Photo of Your Crop</h2>
              <p className="text-gray-600 mb-6">
                Take a clear photo of the affected plant part (leaf, stem, fruit) for the most accurate diagnosis.
              </p>
              
              {/* Crop Type Selection */}
              <div className="mb-6">
                <label htmlFor="crop-type" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Crop Type
                </label>
                <select
                  id="crop-type"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-marketash-blue focus:ring focus:ring-marketash-blue focus:ring-opacity-50"
                >
                  {cropTypes.map((crop) => (
                    <option key={crop.value} value={crop.value}>
                      {crop.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {!preview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <Camera className="h-12 w-12 text-gray-400" />
                    </div>
                    <p className="text-gray-500">
                      Drag and drop your image here, or click to browse
                    </p>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="inline-flex items-center justify-center px-4 py-2 bg-marketash-blue text-white rounded-md font-medium text-sm hover:bg-marketash-blue/90 transition-colors">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </span>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={preview} 
                    alt="Crop preview" 
                    className="w-full rounded-lg object-contain max-h-[400px]"
                  />
                  <button 
                    onClick={clearImage}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="h-5 w-5 text-gray-700" />
                  </button>
                  
                  <div className="mt-6">
                    <Button 
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                      className="w-full py-6 text-lg bg-marketash-green hover:bg-marketash-green/90"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                          Analyzing Image...
                        </>
                      ) : (
                        <>
                          Diagnose Crop Disease
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Results Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              {!result ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="bg-marketash-lightBlue rounded-full p-6 mb-4">
                    <Camera className="h-12 w-12 text-marketash-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No diagnosis yet</h3>
                  <p className="text-gray-600 max-w-md">
                    Upload a photo of your crop and click "Diagnose Crop Disease" to receive an analysis and treatment recommendations.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Diagnosis Results</h2>
                    <div className="bg-marketash-lightGreen text-marketash-green px-3 py-1 rounded-full text-sm font-medium">
                      {result.confidence}% Confidence
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-marketash-blue mb-2">
                      {result.disease}
                    </h3>
                    <p className="text-gray-700">
                      {result.description}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-lg mb-2">Recommended Treatment:</h4>
                    <ul className="space-y-2">
                      {result.treatment.map((item: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-marketash-green mr-2 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Prevention Tips:</h4>
                    <ul className="space-y-2">
                      {result.prevention.map((item: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-marketash-green mr-2 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-8 p-4 bg-marketash-lightBlue rounded-lg">
                    <p className="text-sm text-marketash-blue">
                      <strong>Note:</strong> This is an AI-powered diagnosis and should be used as guidance. 
                      For severe cases, consult with a local agricultural extension officer.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CropDoctor;
