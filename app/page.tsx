export default function Home() {
  return (
    <main className="bg-gray-300 sm:bg-red-100 md:bg-green-100 lg:bg-cyan-100 xl:bg-orange-100 2xl:bg-purple-100 h-screen p-5 flex items-center justify-center ">
      <div className="bg-white max-w-screen-sm w-full shadow-lg p-5 rounded-2xl flex flex-col gap-4">
        {['Nico', 'Me', 'You', 'Yourself', ''].map((person, index) => (
          <div key={index} className="flex items-center gap-5">
            <div className="size-10 bg-blue-400 rounded-full" />
            <div className="text-lg font-medium empty:w-24 empty:h-5 empty:rounded-full empty:animate-pulse empty:bg-gray-300">
              {person}
            </div>
            <div className="size-6 bg-red-500 text-white flex items-center justify-center rounded-full relative">
              <span className="z-10">{index}</span>
              <div className="size-6 bg-red-500 rounded-full absolute animate-ping"></div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
