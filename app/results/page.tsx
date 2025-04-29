"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ResultsPage = () => {
  const router = useRouter();


  return (
    <div>
      <h1>Search Results</h1>
      {/* Render your results here */}
    </div>
  );
};

export default ResultsPage;
