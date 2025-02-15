"use client";

import { ObjectId } from 'mongodb';
import { useState, useEffect } from "react";
import { TbCat, TbDog, TbDogBowl, TbUserCircle, TbDna2, TbPhone, TbCalendarEventFilled } from "react-icons/tb";
import { FaChevronDown } from 'react-icons/fa';
import { MdDelete, MdEdit } from 'react-icons/md';
import styles from "../pets/styles/pet.module.css";
import { Header } from "@/app/_components/header";
import Modal from "@/app/_components/modal";
import PetForm from "@/app/_components/pet-form";
import EditForm from "@/app/_components/pet-edit-form";

export enum PetSpecies {
  Cachorro = "cachorro",
  Gato = "gato",
}

interface PetsProps {
  _id: ObjectId;
  petName: string;
  petSpecies: PetSpecies;
  petBreed: string;
  petBirth: string;
  petOwner: string;
  ownerPhone: string;
}

interface ResponseProps {
  statusCode: number;
  message: string;
  data: PetsProps[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPets: number;
  };
}

export default function PetsPage() {
  const [pets, setPets] = useState<PetsProps[]>([]);
  const [filteredPets, setFilteredPets] = useState<PetsProps[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<PetsProps | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const fetchPets = async (page: number = 1, limit: number = 8) => {
    try {
      const response = await fetch(`https://softpet-api.onrender.com/pet/all-pets?page=${page}&limit=6`);
      if (!response.ok) {
        console.error("Erro na resposta da API:", response.status);
        throw new Error("Erro ao buscar os pets.");
      }

      const data: ResponseProps = await response.json();
      setPets(data.data || []);
      setFilteredPets(data.data || []);
      setTotalPages(data.pagination.totalPages);
      setCurrentPage(data.pagination.currentPage);
    } catch (error) {
      console.error("Erro ao fazer o fetch:", error);
    }
  };

  useEffect(() => {
    fetchPets(currentPage);
  }, [currentPage]);

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    const filtered = pets.filter(pet =>
      pet.petName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPets(filtered);
  };

  const handleEditClick = (pet: PetsProps) => {
    setSelectedPet(pet);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleDeleteClick = (pet: PetsProps) => {
    setSelectedPet(pet);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePet = async () => {
    if (!selectedPet) return;

    try {
      const response = await fetch(`https://softpet-api.onrender.com/pet/${selectedPet._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.error("Erro ao excluir o pet");
        throw new Error("Erro ao excluir o pet.");
      }

      setPets(pets.filter(pet => pet._id.toString() !== selectedPet._id.toString()));
      setFilteredPets(filteredPets.filter(pet => pet._id.toString() !== selectedPet._id.toString()));
      alert("Pet excluído com sucesso!");
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Erro ao excluir o pet:", error);
      alert("Erro ao excluir o pet.");
      setIsDeleteModalOpen(false);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const toggleCard = (id: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    // Se o aniversário ainda não passou este ano, subtrai 1 da idade
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };


  return (
    <div className={styles.container}>
      <Header onOpenModal={handleCreateClick} onSearch={handleSearch} />

      {/* Modal de criação de pet */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Cadastrar Pet</h2>
        <PetForm onClose={() => setIsCreateModalOpen(false)} onSuccess={() => fetchPets(currentPage)} />
      </Modal>

      {/* Modal de edição de pet */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Editar Pet</h2>
        {selectedPet && <EditForm pet={selectedPet} onClose={() => setIsModalOpen(false)} onSuccess={() => fetchPets(currentPage)} />}
      </Modal>

      {/* Modal de exclusão de pet */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
  <div className="flex items-center justify-start mb-8"> {/* Alinhando à esquerda */}
    <h1 className="text-white text-3xl font-bold flex items-center space-x-3">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: 'linear-gradient(90deg, #00CAFC 0%, #0056E2 100%)' }}
      >
        <MdDelete className="text-4xl text-white" />
      </div>
      <span>Remover Pet</span>
    </h1>
  </div>

  <p className="text-white text-xl text-center mb-4">Tem certeza de que deseja remover esse Pet?</p>
  <p className="text-white text-xl text-center mb-6">Esta ação é irreversível.</p> {/* Aqui adicionei mb-6 */}

  {/* Botões */}
  <div className="flex justify-between gap-6">
    <button
      onClick={() => setIsDeleteModalOpen(false)}
      className="bg-white text-[#000814] py-2 px-4 rounded-lg hover:bg-gray-300 transition w-1/2"
    >
      Voltar
    </button>
    <button
      onClick={confirmDeletePet}
      className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition w-1/2 flex items-center justify-center space-x-2"
    >
      <MdDelete className="text-2xl" /> {/* Estilizando o ícone */}
      <span>Remover</span>
    </button>
  </div>
</Modal>


      {/* Lista de pets */}
      <div className="container mx-auto p-6 flex-grow">
        <div className={styles.grid}>
          {filteredPets.length === 0 ? (
            <p className='text-white'>Carregando os pets...</p>
          ) : (
            filteredPets.map((pet) => (
              <div
                key={pet._id.toString()}
                className="bg-[#00060F] p-6 rounded-xl shadow-xl border-2 border-transparent transition-all duration-300 ease-in-out hover:border-[#0056E2] hover:shadow-2xl w-96"  // Aumento da largura para 24rem
              >
                <div className="flex flex-col items-start text-white">
                  {/* Seção do ícone e nome do pet */}
                  <div className="flex items-center mb-4">
                    {pet.petSpecies === PetSpecies.Gato ? (
                      <div className="bg-gradient-to-r from-[#00CAFC] to-[#0056E2] rounded-full p-2 w-12 h-12 flex items-center justify-center">
                        <TbCat className="w-8 h-8 text-white" />
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-[#00CAFC] to-[#0056E2] rounded-full p-2 w-12 h-12 flex items-center justify-center">
                        <TbDog className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <h1 className="font-semibold flex items-center ml-4">
                      <TbDogBowl className="w-5 h-5 mr-2" /> {pet.petName}
                    </h1>
                  </div>

                  {/* Seção do dono */}
                  <p className="text-sm flex items-center mb-4">
                    <TbUserCircle className="w-5 h-5 mr-2" /> Dono: {pet.petOwner}
                  </p>

                  {/* Dropdown */}
                  <div className="flex items-start w-full">
                    <details className="group cursor-pointer w-full">
                      <summary className="flex items-center text-blue-500">
                        <FaChevronDown className="w-6 h-6" />
                      </summary>
                      <div className="mt-2 p-4 bg-[#00060F] rounded-lg border border-[#fff1] space-y-2">
                        <p className="flex items-center text-white">
                          <TbDna2 className="w-5 h-5 mr-2" /> <strong>Raça:</strong>&nbsp; {pet.petBreed}
                        </p>

                        <p className="flex items-center text-white">
                          <TbCalendarEventFilled className="w-5 h-5 mr-2" /> <strong>Idade:</strong>&nbsp; {calculateAge(pet.petBirth)} anos
                        </p>

                        <p className="flex items-center text-white">
                          <TbPhone className="w-5 h-5 mr-2" /> <strong>Telefone:</strong>&nbsp; {pet.ownerPhone}
                        </p>

                        <div className="mt-2 flex flex-col space-y-4">
                          {/* Botão de Editar com ícone de lápis e fundo azul */}
                          <button
                            onClick={() => handleEditClick(pet)}
                            className="flex items-center justify-center text-white px-4 py-2 rounded-lg transition-colors duration-300 w-full"
                            style={{
                              background: 'linear-gradient(90deg, #00CAFC 0%, #0056E2 100%)',
                              border: '2px solid transparent',
                              backgroundClip: 'border-box',
                            }}
                            onMouseEnter={(e) => (e.target as HTMLButtonElement).style.background = 'linear-gradient(90deg, #0056E2 0%, #003B7A 100%)'}
                            onMouseLeave={(e) => (e.target as HTMLButtonElement).style.background = 'linear-gradient(90deg, #00CAFC 0%, #0056E2 100%)'}
                          >
                            <MdEdit className="w-5 h-5 mr-2" />
                            Editar
                          </button>

                          {/* Botão de Remover com ícone de lixeira e fundo vermelho */}
                          <button
                            onClick={() => handleDeleteClick(pet)}
                            className="flex items-center justify-center text-white bg-red-500 border-2 border-red-500 px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300 w-full"
                          >
                            <MdDelete className="w-5 h-5 mr-2" />
                            Remover
                          </button>
                        </div>

                      </div>
                    </details>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pagination fixed bottom-5 right-5 flex items-center gap-4 bg-black bg-opacity-60 p-3 rounded-full shadow-lg">
          <button
            onClick={goToPrevPage}
            disabled={currentPage <= 1}
            className="text-white text-2xl cursor-pointer hover:scale-110 disabled:text-gray-500 transition-transform"
          >
            &larr;
          </button>
          <span className="text-white text-sm">{currentPage} de {totalPages}</span>
          <button
            onClick={goToNextPage}
            disabled={currentPage >= totalPages}
            className="text-white text-2xl cursor-pointer hover:scale-110 disabled:text-gray-500 transition-transform"
          >
            &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
