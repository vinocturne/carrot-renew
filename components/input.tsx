import { ForwardedRef, InputHTMLAttributes, forwardRef } from 'react';

interface InputProps {
  name: string;
  errors?: string[];
}
const _Input = (
  { name, errors = [], ...rest }: InputProps & InputHTMLAttributes<HTMLInputElement>,
  ref: ForwardedRef<HTMLInputElement>
) => {
  console.log(rest);
  return (
    <div className="flex flex-col gap-2">
      <input
        ref={ref}
        name={name}
        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 ring-neutral-200 focus:ring-orange-500 border-none px-3 placeholder:text-neutral-400"
        {...rest}
      />
      {errors?.map((error, index) => (
        <span className="text-red-500 font-medium" key={index}>
          {error}
        </span>
      ))}
    </div>
  );
};

export default forwardRef(_Input);
