'use client'

import { useState } from 'react'
import PetaSulsel from './PetaSulsel'


export default function Peta() {
  const [cardActive, setCardActive] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState(null)

// s

  return (
    <div className='flex flex-col justify-center items-center p-6'>
      <h1 className='text-3xl font-bold mb-6'>KABUPATEN SULAWESI SELATAN</h1>

      <div className='flex'>
        <PetaSulsel  />
      </div>
    </div>
  )
}
