export default function Home() {
  return (
    <main className="bg-gray-300 h-screen p-5 flex items-center justify-center dark:bg-gray-700">
      <div className="bg-white max-w-screen-sm w-full shadow-lg p-5 rounded-2xl dark:bg-gray-500">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <span className="text-gray-600 font-semibold -mb-1 dark:text-gray-300">In transit</span>
            <span className="text-4xl font-semibold dark:text-white">Coolblue</span>
          </div>
          <div className="size-12 bg-orange-300 rounded-full" />
        </div>
        <div className="my-2 flex items-center gap-2">
          <span className="bg-green-400 text-white uppercase px-2.5 py-1.5 text-xs rounded-full font-medium hover:bg-green-500 hover:scale-125 transition">
            Today
          </span>
          <span className="dark:text-gray-100">9:30 - 10:30</span>
        </div>
        <div className="relative">
          <div className="bg-gray-200 absolute rounded-full w-full h-2" />
          <div className="bg-green-400 absolute rounded-full w-2/3 h-2" />
        </div>
        <div className="flex justify-between items-center mt-5 text-gray-600 dark:text-gray-300">
          <span>Expected</span>
          <span>Sorting center</span>
          <span>In transit</span>
          <span className="text-gray-400 dark:text-gray-800">Delivered</span>
        </div>
      </div>
    </main>
  );
}
