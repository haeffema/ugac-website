import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <Image
          src="/404.jpg"
          alt="404 Not Found"
          width={300}
          height={300}
          className="mb-6"
          unoptimized
        />
        <h2 className="text-3xl font-bold text-red-500 mb-4">
          HUH ... WHERE AM I?
        </h2>
      </div>
    </div>
  );
}
