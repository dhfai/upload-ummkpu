'use client'

import { SetStateAction, useState } from 'react'
import PetaSulsel from './PetaSulsel'


export default function Peta() {
  const [cardActive, setCardActive] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState(null)

  const handleClick = (region: SetStateAction<null>) => {
    setSelectedRegion(region)
    setCardActive(true)
  }

  return (
    <div className='flex flex-col justify-center items-center'>
      <h1 className='text-3xl font-bold mb-6'>KABUPATEN SULAWESI SELATAN</h1>

      <div className='flex'>
        <PetaSulsel onSelectRegion={handleClick} />
      </div>
    </div>
  )
}
