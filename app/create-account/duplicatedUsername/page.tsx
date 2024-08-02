'use client';

import FormButton from '@/components/button';
import Input from '@/components/input';
import { useFormState } from 'react-dom';
import { createNewUsernameAccount } from './action';
import { useSearchParams } from 'next/navigation';

export default function DuplicatedUsername() {
  const searchParams = useSearchParams();
  const [state, dispatch] = useFormState(createNewUsernameAccount, null);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">OOPS!!</h1>
        <h2 className="text-xl">your username is already taken!!</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input name="username" type="text" placeholder="Username" required errors={state?.fieldErrors.username} />
        <Input name="github_id" className="hidden" defaultValue={searchParams.get('id')!} type="text" />
        <Input name="avatar" className="hidden" defaultValue={searchParams.get('avatar_url')!} type="text" />
        <FormButton text="Create Account" />
      </form>
    </div>
  );
}
