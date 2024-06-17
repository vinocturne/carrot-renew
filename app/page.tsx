export default function Home() {
  return (
    <main className="bg-gray-300 sm:bg-red-100 md:bg-green-100 lg:bg-cyan-100 xl:bg-orange-100 2xl:bg-purple-100 h-screen p-5 flex items-center justify-center ">
      <div className="bg-white max-w-screen-sm w-full shadow-lg p-5 rounded-2xl flex flex-col gap-4">
        <div className="group flex flex-col">
          <input className="bg-gray-100 w-full" placeholder="Write your Email" />
          <span className="group-focus-within:block hidden">Make sure it is a valid email...</span>
          <button>Submit</button>
        </div>
      </div>
    </main>
  );
}
