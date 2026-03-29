import React from 'react';
import { X, Map, Heart, Filter } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative z-10 p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-extrabold text-indigo-900 mb-6">How to use the Map</h2>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="bg-blue-50 p-3 rounded-xl h-fit shrink-0"><Map className="text-blue-600" size={24} /></div>
            <div>
              <h4 className="font-bold text-gray-800 mb-1">Exploring Events</h4>
              <p className="text-sm text-gray-600 leading-relaxed">Switch between <b>Map View</b> to see locations and <b>Calendar View</b> to browse cards. Use the top filters to find specific countries.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-red-50 p-3 rounded-xl h-fit shrink-0"><Heart className="text-red-500" size={24} /></div>
            <div>
              <h4 className="font-bold text-gray-800 mb-1">Favorites</h4>
              <p className="text-sm text-gray-600 leading-relaxed">Click the <b>Heart Icon</b> on any event to save it. Access your list by clicking the "Saved" button at the top.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-purple-50 p-3 rounded-xl h-fit shrink-0"><Filter className="text-purple-600" size={24} /></div>
            <div>
              <h4 className="font-bold text-gray-800 mb-1">Filtering</h4>
              <p className="text-sm text-gray-600 leading-relaxed">Use the sidebar to filter by <b>Category</b>, <b>Facilitator</b>, or <b>Date</b> to find exactly what you are looking for.</p>
            </div>
          </div>
        </div>

        <button onClick={onClose} className="w-full mt-8 bg-indigo-900 text-white font-bold py-3 rounded-xl hover:bg-indigo-800 transition-colors shadow-lg">
          Got it!
        </button>
      </div>
    </div>
  );
};

export default HelpModal;
