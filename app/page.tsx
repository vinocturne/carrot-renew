export default function Home() {
  return (
    <main className="bg-gray-300 sm:bg-red-100 md:bg-green-100 lg:bg-cyan-100 xl:bg-orange-100 2xl:bg-purple-100 h-screen p-5 flex items-center justify-center ">
      <div className="bg-white max-w-screen-sm w-full shadow-lg p-5 rounded-2xl flex flex-col md:flex-row gap-2">
        <input
          className="w-full rounded-full h-12 bg-gray-200 pl-5 outline-none ring ring-transparent focus:ring-orange-500 focus:ring-offset-2 transition-shadow placeholder:drop-shadow invalid:focus:ring:bg-red-600 peer"
          type="email"
          required
          placeholder="Email Address"
        />
        <span className="text-red-500 font-medium hidden peer-invalid:block">Email is required</span>
        <button className="text-white bg-opacity-50 py-2 rounded-full active:scale-90 outline-none focus:scale-90 transition-transform font-medium md:px-10 bg-black peer-required:bg-green-400">
          Log in
        </button>
      </div>
    </main>
  );
}
