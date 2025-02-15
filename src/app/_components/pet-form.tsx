"use client";

import { useState } from "react";
import { TbCirclePlus, TbDogBowl, TbUserCircle, TbDna2, TbPhone, TbCalendarEventFilled } from "react-icons/tb";  // Ícones

interface PetsProps {
  id: string;
  petName: string;
  petSpecies: string;
  petBreed: string;
  petBirth: string;
  petOwner: string;
  ownerPhone: string;
}

interface PetFormProps {
  pet?: PetsProps | null;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export default function PetForm({ pet, onClose, onSuccess }: PetFormProps) {
  const [formData, setFormData] = useState({
    petid: pet?.id ?? "",
    petName: pet?.petName ?? "",
    petSpecies: pet?.petSpecies ?? "cachorro",
    petBreed: pet?.petBreed ?? "",
    petBirth: pet?.petBirth ?? "",
    petOwner: pet?.petOwner ?? "",
    ownerPhone: pet?.ownerPhone ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = pet ? "update" : "create";
    const response = await fetch(`https://softpet-api.onrender.com/pet/${endpoint}`, {
      method: pet ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert(pet ? "Pet atualizado com sucesso!" : "Pet cadastrado com sucesso!");
      await onSuccess();
      onClose();
    } else {
      alert(pet ? "Erro ao atualizar pet!" : "Erro ao cadastrar pet!");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-6 p-8 bg-[#000814] text-white rounded-2xl shadow-xl w-[600px] h-[560px]"
        style={{
          border: '2px solid',
          borderImage: 'linear-gradient(90deg, #00CAFC 0%, #0056E2 100%)',
          borderImageSlice: 1,
        }}
      >
        <h1 className="text-white text-3xl font-bold flex items-center space-x-3">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(90deg, #00CAFC 0%, #0056E2 100%)' }}
          >
            <TbCirclePlus className="text-4xl text-white" />
          </div>
          <span>{pet ? "Atualizar Pet" : "Cadastrar Pet"}</span>
        </h1>
  
        <div className="flex w-full space-x-4">
          <div className="flex-1 flex flex-col items-center">
            <label htmlFor="petName" className="flex items-center text-white space-x-2 mb-2">
              <TbDogBowl className="text-white text-2xl" />
              <span>Nome</span>
            </label>
            <input
              type="text"
              id="petName"
              name="petName"
              value={formData.petName}
              onChange={handleChange}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white bg-[rgba(64,74,92,1)] w-full"
              required
              placeholder="Nome Sobrenome"
            />
          </div>
  
          <div className="flex-1 flex flex-col items-center">
            <label htmlFor="petSpecies" className="flex items-center text-white space-x-2 mb-2">
              <TbDna2 className="text-white text-2xl" />
              <span>Animal</span>
            </label>
            <select
              id="petSpecies"
              name="petSpecies"
              value={formData.petSpecies}
              onChange={handleChange}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white bg-[rgba(64,74,92,1)] w-full"
            >
              <option value="cachorro">Cachorro</option>
              <option value="gato">Gato</option>
            </select>
          </div>
        </div>
  
        {/* Raça e nascimento */}
        <div className="flex w-full space-x-4">
          <div className="flex-1 flex flex-col items-center">
            <label htmlFor="petBreed" className="flex items-center text-white space-x-2 mb-2">
              <TbDna2 className="text-white text-2xl" />
              <span>Raça</span>
            </label>
            <input
              type="text"
              id="petBreed"
              name="petBreed"
              value={formData.petBreed}
              onChange={handleChange}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white bg-[rgba(64,74,92,1)] w-full"
              required
              placeholder="Raça"
            />
          </div>
  
          <div className="flex-1 flex flex-col items-center">
            <label htmlFor="petBirth" className="flex items-center text-white space-x-2 mb-2">
              <TbCalendarEventFilled className="text-white text-2xl" />
              <span>Nascimento (aproximado)</span>
            </label>
            <input
              type="date"
              id="petBirth"
              name="petBirth"
              value={formData.petBirth}
              onChange={handleChange}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white bg-[rgba(64,74,92,1)] w-full"
              required
              placeholder="15/02/2025"
            />
          </div>
        </div>
  
        {/* Dono e telefone */}
        <div className="flex w-full space-x-4">
          <div className="flex-1 flex flex-col items-center">
            <label htmlFor="petOwner" className="flex items-center text-white space-x-2 mb-2">
              <TbUserCircle className="text-white text-2xl" />
              <span>Dono</span>
            </label>
            <input
              type="text"
              id="petOwner"
              name="petOwner"
              value={formData.petOwner}
              onChange={handleChange}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white bg-[rgba(64,74,92,1)] w-full"
              required
              placeholder="Nome Sobrenome"
            />
          </div>
          <div className="flex-1 flex flex-col items-center">
            <label htmlFor="ownerPhone" className="flex items-center text-white space-x-2 mb-2">
              <TbPhone className="text-white text-2xl" />
              <span>Telefone</span>
            </label>
            <input
              type="tel"
              id="ownerPhone"
              name="ownerPhone"
              value={formData.ownerPhone}
              onChange={handleChange}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white bg-[rgba(64,74,92,1)] w-full"
              required
              placeholder="(00) 0 0000-0000"
            />
          </div>
        </div>
  
        <div className="flex w-full space-x-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-white text-[#000814] py-2 px-4 rounded-lg hover:bg-gray-300 transition w-1/2">
            Voltar
          </button>
          <button
            type="submit"
            className="text-white py-2 px-4 rounded-lg transition w-1/2"
            style={{
              background: 'linear-gradient(90deg, #00CAFC 0%, #0056E2 100%)',
            }}>
            <TbCirclePlus className="inline mr-2" />{pet ? "Atualizar" : "Cadastrar"}
          </button>
        </div>
      </form>
    </div>
  );
  
}
