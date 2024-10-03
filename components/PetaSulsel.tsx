import Image from 'next/image';
import Link from 'next/link';

import { kabupaten } from '@/utils/map';

// Define a type for the kabupaten object
type Kabupaten = {
  coords: {
    top: string; // Adjust type if necessary (e.g., number or string depending on how you're using it)
    left: string;
  };
  link: string;
  name: string;
};

const PetaSulsel: React.FC = () => {
  return (
    <div className='relative'>
      <Image
        src={'/images/peta-sulsel1.png'}
        alt={'PetaKab Sulawesi Selatan'}
        width={380}
        height={630}
        className='lg:w-[580px] lg:h-[900px]'
      />
      {kabupaten.map((kab: Kabupaten, index: number) => (
        <div
          key={index}
          className='absolute flex flex-col items-center cursor-pointer'
          style={{ top: kab.coords.top, left: kab.coords.left }}
        >
          <Link href={`/tambah-data/kabupaten/${kab.link}`}>
            <i className='tabler-map-pin-filled text-[16px] lg:text-[20px]' />
          </Link>
          <div>{kab.name}</div>
        </div>
      ))}
    </div>
  );
};

export default PetaSulsel;
