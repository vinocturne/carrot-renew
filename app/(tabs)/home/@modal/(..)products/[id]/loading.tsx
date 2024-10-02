import { PhotoIcon } from '@heroicons/react/24/solid';
import BackButton from './back-button';

export default function ModalLoading() {
  return (
    <div className="absolute w-full h-full z-50 flex justify-center items-center bg-opacity-60 bg-black left-0 top-0">
      <BackButton />
      <div className="max-w-screen-sm h-1/2 flex justify-center w-full">
        <div className="aspect-square bg-neutral-700 text-neutral-200 rounded-md flex justify-center items-center">
          <PhotoIcon className="h-28" />
        </div>
      </div>
    </div>
  );
}
