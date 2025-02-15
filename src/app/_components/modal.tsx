'use client';

import React from "react";
import { MdDelete } from "react-icons/md";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gradient-to-r from-[#000814] to-[#001E4D] p-8 rounded-lg shadow-lg w-[600px] h-[300px] relative z-50"
                    style={{
                        border: '2px solid',
                        borderImage: 'linear-gradient(90deg, #00CAFC 0%, #0056E2 100%)',
                        borderImageSlice: 1,
                      }}>
                {children}
            </div>
        </div>
    );
};

export default Modal;
