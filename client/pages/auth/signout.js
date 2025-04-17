import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useRequest from '../../utils/hooks/use-request';

function SignOut() {
  const router = useRouter();
  const { doRequest } = useRequest({
    body: {},
    method: 'post',
    url: '/api/v1/auth/signout',
    onSuccess: () => {
      router.push('/');
    },
  });
  useEffect(() => {
    doRequest();
  }, []);

  return (
    <div>
      <h1>signOut</h1>
    </div>
  );
}

export default SignOut;
