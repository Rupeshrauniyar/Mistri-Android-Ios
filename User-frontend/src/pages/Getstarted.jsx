import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import {ChevronRight, Check, X} from "lucide-react";

const GetStarted = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  // Check if user has already completed onboarding
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem("onboardingCompleted");
    if (onboardingCompleted === "true") {
      // Use replace instead of push to avoid adding to history stack
      navigate("/");
    }
  }, []);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };
  useEffect(() => {
    if (currentStep > 2) {
      localStorage.setItem("onboardingCompleted", "true");
    }
  });
  const handleContinueAsGuest = () => {
    localStorage.setItem("onboardingCompleted", "true");
    localStorage.setItem("user", "guest");

    // Use replace instead of push to avoid adding to history stack
    navigate("/", {replace: true});
  };

  const slides = [
    // Welcome slide
    {
      title: "Welcome to Mistri",
      description: "Find the best professionals for all your home service needs",
      canProceed: true,
    },
    // Terms and Policy slide
    {
      title: "Terms & Privacy Policy",
      description: "Please read and accept our terms and privacy policy to continue",
      content: (
        <div className="mt-4 mb-6 text-left">
          <div className="bg-gray-50 p-4 rounded-lg max-h-[200px] overflow-y-auto text-sm mb-4">
            <h3 className="font-bold mb-2">Terms of Service</h3>
            <p className="mb-2">By using the Mistri app, you agree to these terms which are designed to ensure a great experience for all users.</p>
            <p className="mb-2">1. You must be at least 18 years old to use this service.</p>
            <p className="mb-2">2. You agree to provide accurate information when registering and booking services.</p>
            <p className="mb-2">3. You are responsible for maintaining the confidentiality of your account information.</p>
            <h3 className="font-bold mt-4 mb-2">Privacy Policy</h3>
            <p className="mb-2">We respect your privacy and are committed to protecting your personal data.</p>
            <p className="mb-2">1. We collect information you provide when creating an account and booking services.</p>
            <p className="mb-2">2. We use your location data to connect you with nearby service providers.</p>
            <p className="mb-2">3. We do not sell your personal information to third parties.</p>
          </div>
          <div className="flex items-center mb-2">
            <div
              className={`w-6 h-6 rounded-full border flex items-center justify-center mr-2 cursor-pointer ${
                termsAccepted ? "bg-black border-black text-white" : "border-gray-300"
              }`}
              onClick={() => setTermsAccepted(!termsAccepted)}>
              {termsAccepted && <Check size={16} />}
            </div>
            <label
              className="text-sm cursor-pointer"
              onClick={() => setTermsAccepted(!termsAccepted)}>
              I accept the Terms of Service and Privacy Policy
            </label>
          </div>
        </div>
      ),
      canProceed: termsAccepted,
    },
    // Final slide
    {
      title: "You're All Set!",
      description: "Start exploring and finding the best professionals for your needs",
      image: "https://img.icons8.com/color/240/000000/checked--v1.png",
      canProceed: true,
    },
    {
      title: "One more step.",
      description: "Continue to login or Continue as a guest",
      content: (
        <div className="mt-4 mb-6 text-left  ">
          <div className="my-2 ">
            <Link to="/">
              <button
                onClick={handleContinueAsGuest}
                className="bg-black hover:bg-zinc-800 text-white px-10 py-5 rounded-xl flex">
                Continue as guest
              </button>
            </Link>
          </div>
          <div className="my-2 ">
            <Link to="/login">
              <button className="bg-black hover:bg-zinc-800 text-white px-12 py-5 rounded-xl flex ">Continue to login</button>
            </Link>
          </div>
        </div>
      ),
      canProceed: true,
    },
  ];

  const currentSlide = slides[currentStep];

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      {/* Progress indicator */}
      <div className="w-full px-6 pt-6">
        <div className="w-full h-1 bg-gray-200 rounded-full">
          <div
            className="h-full bg-black rounded-full transition-all duration-300"
            style={{width: `${((currentStep + 1) / slides.length) * 100}%`}}></div>
        </div>
      </div>

      {/* Slide content */}
      <motion.div
        key={currentStep}
        initial={{opacity: 0, x: 100}}
        animate={{opacity: 1, x: 0}}
        exit={{opacity: 0, x: -100}}
        transition={{duration: 0.3}}
        className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {currentSlide.image && (
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className="w-40 h-40 mb-8 object-contain"
          />
        )}
        <h1 className="text-3xl font-bold mb-4">{currentSlide.title}</h1>
        <p className="text-gray-600 mb-6">{currentSlide.description}</p>

        {currentSlide.content}
      </motion.div>

      {/* Navigation buttons */}
      {currentStep === 3 ? (
        <></>
      ) : (
        <div className="p-6">
          <button
            onClick={handleNext}
            disabled={!currentSlide.canProceed}
            className="w-full py-5 hover:bg-zinc-800 rounded-xl flex items-center justify-center bg-black text-white">
            {currentStep === slides.length - 1 ? "Get Started" : "Continue"}
            {currentStep < slides.length - 1 && (
              <ChevronRight
                className="ml-2"
                size={20}
              />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default GetStarted;
