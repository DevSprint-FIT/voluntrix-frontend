import React from "react";
import { X, Copy } from "lucide-react";
import { FaFacebook, FaWhatsapp, FaLinkedin, FaInstagram } from "react-icons/fa"; 
import { Button } from "@heroui/button";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  handleShareClick: (platform: string) => void; // New prop to track share clicks
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareUrl, handleShareClick }) => {
  if (!isOpen) return null;

  const openShareWindow = (url: string) => {
    window.open(url, "shareWindow", "width=600,height=400");
  };

  const onFacebookShare = () => {
    handleShareClick("facebook");
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    openShareWindow(facebookUrl);
  };

  const onWhatsAppShare = () => {
    handleShareClick("whatsapp");
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareUrl)}`;
    openShareWindow(whatsappUrl);
  };

  const onLinkedInShare = () => {
    handleShareClick("linkedin");
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    openShareWindow(linkedinUrl);
  };

  // Instagram does not have a direct share URL, so just open profile 
  const onInstagramClick = () => {
    handleShareClick("instagram");
    const instagramUrl = "https://www.instagram.com/YOUR_INSTAGRAM_HANDLE";
    openShareWindow(instagramUrl);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-shark-950 bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full h-[22rem] p-6 relative flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-shark-500 hover:text-shark-700"
          aria-label="Close share modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-secondary text-2xl font-bold mb-2">Share</h2>

        {/* Social Media Icons */}
        <div className="flex items-center justify-center gap-8 mb-5 mt-5 text-6xl">
          <div className="flex flex-col items-center">
            <button
              onClick={onFacebookShare}
              className="text-[#1877F2] focus:outline-none"
              aria-label="Share on Facebook"
            >
              <FaFacebook />
            </button>
            <p className="text-sm text-gray-600 mt-2">Facebook</p>
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={onWhatsAppShare}
              className="text-[#25D366] focus:outline-none"
              aria-label="Share on WhatsApp"
            >
              <FaWhatsapp />
            </button>
            <p className="text-sm text-gray-600 mt-2">WhatsApp</p>
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={onLinkedInShare}
              className="text-[#0077B5] focus:outline-none"
              aria-label="Share on LinkedIn"
            >
              <FaLinkedin />
            </button>
            <p className="text-sm text-gray-600 mt-2">LinkedIn</p>
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={onInstagramClick}
              className="text-[#E1306C] focus:outline-none"
              aria-label="Visit Instagram"
            >
              <FaInstagram />
            </button>
            <p className="text-sm text-gray-600 mt-2">Instagram</p>
          </div>
        </div>

        {/* Copy Link Section */}
        <div className="mt-7">
          <p className="text-sm text-shark-600 mb-3">Copy the link below to share:</p>
          <div className="flex items-center justify-between px-3 py-2 bg-shark-50 rounded-md">
            <span>{shareUrl}</span>
            <Button
              onPress={copyToClipboard}
              className="px-4 py-2 rounded-full bg-shark-950 hover:bg-shark-400 text-white text-sm flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
