import Link from 'next/link'
 
export default function NotFound() {
    return (
        <div className="flex items-center justify-center text-white mt-40">
          <div className="bg-gray-800 rounded-lg shadow-lg p-8 text-center max-w-md">
            <h2 className="text-4xl font-bold mb-4">Page Non trouvé</h2>
            <p className="text-lg mb-6">Impossible de trouver la ressource demandée.</p>
            <Link href="/" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300">
            Retour à l'accueil
            </Link>
          </div>
        </div>
      );
}