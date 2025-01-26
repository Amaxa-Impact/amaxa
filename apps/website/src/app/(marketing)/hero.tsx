"use client"
import React, { useState } from 'react'
import Typewriter from './_components/rotate-text'
import CirclingElements from './_components/rotate-image'

export const Hero = () => {
  const [currentTypewriterIndex, setCurrentTypewriterIndex] = useState(0)

  const exampleImages = [
    { src: "https://s3-alpha-sig.figma.com/img/f129/43aa/2300062d97dac975155c10c1533ee7a2?Expires=1736726400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=nepkefjx4IEZpjfLnkOM3iw5ylKQ6VgnUrK6R~FgNmU2A7GRRCkZEd44mKw2MlKVWcEpIjJmZjGZ9BuSnsDVdLtswFoO-83puDK9OHfeJPzV0asBn0wakf4ZfKQcyoZEur7RLo7B7lcAZGXDzBnJ9R8IM~BETOcQj8F9gv-T17dDHQ~aKMqoag50kDESl6YlftKegTs9y~4AtKFRyrq3EVFg2jM5pHgTO-3yir-Yfo5czQbuukQ-9vvu1OarZ8k17OdSFhALvX6wXDN0ILJ-Yp1tnaPdJakOgkfGmWb~kEvoYxxU-S~VEeR-Pg~R7Hqqvnel5uT4Pj~PkmFK1srq-A__" },
    { src: "https://s3-alpha-sig.figma.com/img/3bf4/4c2f/4be758dfca639d0cf5ebe78f30db732a?Expires=1736726400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=bLgfSxpUeTVEeGzMPWuwnYekF1xQ9-AXr6dqlbbGTgaJk41B5ImS4IrEvZVM5vEjPAZ1ewinJpcC7Xr6hD4QMDNz-Jc0m2s~jcvwazxxYUISWRHfpsjvSQudl0JUYV1BvB512yHMuAiBFoUY3nN2usfKsN4U1qFdNu19c2-m~yascHfy4JYeptilNdh0Z3cUasIH9U4ej1zzCJSY94nbikyiIfFOmJp2mMzTdm3rUtnFHoYRZNdzf1R5mXoYMrjADyug-v10taK5najvbjjHYHl6ys2iDWMHk9H5245YCy4KuXs6LRYele2GI3gbgBiOJNYAu2Vxik7eUiGdH130Xw__" },
    { src: "https://s3-alpha-sig.figma.com/img/0186/a838/75cd31338ec35cc9be4ac004b0332ccd?Expires=1736726400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LBebL-5-mWC6SZePMhX1Qy9WjUXs-0X8EpFJWkZItO54XCkL-TdbK6aUc3x0-drpOhFKphZFKYeSJkBM6QA0iQm1v3ldubIeiEr3ygNbkguimvNokU5MeErEmIdQFuB55z1mHp8Xalj61Xhzfnl7aJsEQwF2OlBlvwH6IHLWBNLPgKuDIZRf83R873SBYneTRfWbXCouLZvNnge7zr0bCu9UTUWpG3RIwT4T6sVjpn8BDOnSLCXz855mtLNr5u~V6YqhIcK2LCtzGmzEiDlj7ATrl9BvPrvGos1A3r8I0PPk7-U9ZlCHGPRKydVH7M0hHA9Y5hw17OG2KtZPsGgV0Q__" },
    { src: "https://s3-alpha-sig.figma.com/img/460b/cbba/718d4a78c7a4e4bddd4e27728cec5c21?Expires=1736726400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Q4X-Be6Ont2UOxxLtpabyMDOMuTNILCKykmNkw1jWgdd1pDpZZgOXzzxo303L6uPzDWa-ncBislUeLJGrelxQir~T~2z~W9YrFuo5xJEp9AIJZDB8eM3tlkrhfZ2FCWAfJcVolxpr5RzP6pCiDQneKPsITsttwHzZO93V808GDoW-6Q5XhqEsnNpEKXwofudLsm5QDZCW4Vth0sYaO1~d7S6o2wpMNP5Hfbk8Se8S7hPVapvBMoF3kPi5r6vmyQnouamy07UxaVS2mFgAPf3BM7Kn~23aL-czlGjcIchmtReWl2sBvk7MSbFy2PTfRjRkEangp76mGw0LvPrxsNTFw__" },
    { src: "https://s3-alpha-sig.figma.com/img/4716/2891/49a52dbc204c5ea8ab3a717cf2dbd5b4?Expires=1736726400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZUCZD3gs2Ia1dbtHxgN0msONXJjkaGMyU8enrEwTcKNejItAWe5IxVK4tHk9f0kNVm8EfliX2-gmquWTw80QIB~NByVh3EIOltbY0x32XOEADbgBZXHnmFmdT2gFNWfC2s183b-nKSMY3NfZCgRDGbLsogz3QOGVd7ty0gLBogrDg3mdVWMuPbuwtbfrZByimWV0iWZRAkY81nYDKryD~9U8oR3WNK2-Nvq9J3kWSpGjmNQnWHRZq5kWqmYdzySrmigOybfwWXb4dYakVO4S-4O8m5PzV5Ty1e3RLEHR3-SJMt381~CspQwae8mSLDE5uspqeHrpzbc0GlqlRlzvVg__ " },
    { src: "/placeholder.svg?height=400&width=600&text=Entertainment" },
    { src: "/placeholder.svg?height=400&width=600&text=Travel" },
    { src: "/placeholder.svg?height=400&width=600&text=Productivity" },
  ]

  const features = [
    "“I provided light for grandmothers in Uganda”  ",
    "Image 2",
    "Image 3",
    "Image 4",
    "Image 5",
    "Image 6",
    "Image 7",
    "Image 8",
  ]

  const handleTypewriterChange = (index: number) => {
    setCurrentTypewriterIndex(index)
  }

  return (
    <div className="flex flex-col md:flex-row bg-white w-full px-8 py-10 md:py-16 md:px-16">
      {/* Left Column */}
      <div className="max-w-lg flex flex-col gap-4">
        <p className="text-xl text-gray-700">
          Change “I wish I could help” to
        </p>
        <h1 className="text-4xl md:text-5xl font-medium text-gray-800 leading-tight">
          <Typewriter text={features} />
        </h1>
        <div className="flex items-center gap-4 mt-4">
          <button className="bg-[#BCD96C] border border-black rounded-full px-6 py-2 text-gray-800">
            Join Us
          </button>
          <button className="bg-white border border-gray-700 rounded-full px-6 py-2 text-gray-800">
            Explore All Projects
          </button>
        </div>
      </div>

      {/* Right Column (Images) */}
      <div className="flex justify-center md:justify-end flex-1 mt-8 md:mt-0">
        <div className="relative flex gap-4">
          <CirclingElements activeIndex={currentTypewriterIndex} images={exampleImages} />
        </div>
      </div>
    </div>
  )
}

