interface EnvVarsProps {
  isProduction: boolean;
}

/**
 * Display environment variables
 */
export default function EnvVars({ isProduction }: EnvVarsProps) {
  return (
    <div className="flex justify-center py-3">
      <div className="flex flex-col items-start space-y-2 px-5 md:px-20 py-3 border border-gray-300 rounded-md bg-gray-50">
        <h2 className="text-lg font-semibold text-black mb-2">Environment Variables</h2>
        <p className="text-gray-700 flex">
          <span className="font-bold mr-2">NODE_ENV</span>
          <span className={`${isProduction ? 'text-red-500' : 'text-gray-700'}`}>
            {process.env.NODE_ENV}
          </span>
        </p>
        <p className="text-gray-700 flex">
          <span className="font-bold mr-2">NEXT_PUBLIC_ENV</span>
          <span className={`${isProduction ? 'text-red-500' : 'text-gray-700'}`}>
            {process.env.NEXT_PUBLIC_ENV}
          </span>
        </p>
      </div>
    </div>
  );
}
