import "@/app/globals.css";
import { Header } from "./_components/header"
import PetsPage from './pets/page';
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'SoftPet - Home',
  description: 'SoftPet- Desafio Frontend SoftMakers Br',
}

export default function Home() {
  return (
    <main>
      <div><PetsPage/></div>
    </main>
  );
}
