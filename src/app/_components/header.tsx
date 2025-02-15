import "@/app/globals.css";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TbCirclePlus } from "react-icons/tb";
import { TbSearch } from "react-icons/tb";
import Image from "next/image";

interface HeaderProps {
  onOpenModal: () => void;
  onSearch: (searchTerm: string) => void;  // Adiciona a função de pesquisa
}

export function Header({ onOpenModal, onSearch }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);  // Chama a função de pesquisa
  };

  return (
    <header className="flex flex-col items-center space-y-8 py-8">
      <div className="w-full pl-8">
        <Image src="/logo.svg" alt="Logo" width={150} height={150} />
      </div>

      <div className="flex items-center w-full px-8">
        <div className="relative flex items-center flex-1 max-w-[1200px]">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-500 p-4 rounded h-full flex items-center justify-center">
            <TbSearch className="text-blue-950 text-xl" />
          </div>

          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-[3px] border-[rgba(64,74,92,1)] text-white pl-[70px] pr-20 w-full h-[50px] rounded-[10px]"
            aria-label="Pesquisar"
          />

          <Button
            onClick={handleSearch}  // Chama a função de pesquisa ao clicar
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[rgba(64,74,92,1)] text-white hover:bg-[rgba(64,74,92,1)]/80 w-[106px] h-[36px] rounded-[5px] text-[15px] font-bold"
            aria-label="Botão de Pesquisa"
          >
            Pesquisar
          </Button>
        </div>

        <Button
          onClick={onOpenModal}
          className="ml-6 w-[156px] h-[50px] bg-gradient-to-r from-[#00CAFC] to-[#0056E2] text-white hover:opacity-80 flex items-center justify-center space-x-1 rounded-[10px]"
          aria-label="Cadastrar Pet"
        >
          <TbCirclePlus style={{ width: "25px", height: "25px" }} />
          <span className="text-[15px] font-bold">Cadastrar</span>
        </Button>
      </div>
    </header>
  );
}
