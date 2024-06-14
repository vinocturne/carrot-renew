export default function Home() {
  return (
    <main className="bg-gray-300 h-screen p-5 flex items-center justify-center ">
      <div className="bg-white max-w-screen-sm w-full shadow-lg p-5 rounded-2xl flex flex-col gap-2">
        <input
          className="w-full rounded-full h-12 bg-gray-200 pl-5 outline-none ring ring-transparent focus:ring-orange-500 focus:ring-offset-2 transition-shadow placeholder:drop-shadow"
          type="text"
          placeholder="Search here"
        />
        <button className="bg-black text-white bg-opacity-50 py-2 rounded-full active:scale-90 outline-none focus:scale-90 transition-transform font-medium">
          Search
        </button>
      </div>
    </main>
  );
}
