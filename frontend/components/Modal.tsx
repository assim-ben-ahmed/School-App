'use client';

import { useUIStore } from '@/lib/store';
import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function Modal() {
    const { isModalOpen, modalContent, closeModal } = useUIStore();

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={closeModal}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
                {/* Close Button */}
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>

                {/* Content */}
                <div className="p-6">{modalContent}</div>
            </div>
        </div>
    );
}
