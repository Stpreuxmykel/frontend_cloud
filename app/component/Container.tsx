"use client";

import React, { useEffect, useState } from 'react'

interface ContainerProps {
    children: React.ReactNode;
}
const Container: React.FC<ContainerProps> = ({
    children,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if(!isMounted) return null;

  return (
    <div className='
    max-w-[2520px]
    mx-auto
    xl:px-20
    md:px-10
    sm:px-2
    px-4
    '>
        {children}
    </div>
  )
}

export default Container