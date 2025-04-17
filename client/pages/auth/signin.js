import Link from 'next/link';
import Image from 'next/image';
import signup from '../../public/images/signup.webp';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useRequest from '../../utils/hooks/use-request';

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { errors, doRequest } = useRequest({
    method: 'post',
    url: '/api/v1/auth/signin',
    body: {
      email,
      password,
    },
    onSuccess: () => {
      router.push('/');
    },
  });

  async function handleSignUp(e) {
    e.preventDefault();
    await doRequest();

  }
  return (
    <>
      <div className="container d-flex justify-content-center align-items-center mt-5">
        <div className="mt-5 lh-lg p-5 d-flex flex-column  align-items-center">
          <h4 className="fw-bolder">Explore Simple Flexible Solutions</h4>
          <p
            className="fs-5 text-body-secondary mb-3 text-start"
            style={{ marginLeft: '-70px' }}
          >
            To learn more, visit test@test.com
          </p>
          <Image
            width={300}
            height={250}
            src={signup}
            alt="...."
            className="mt-4 ms-5 "
            style={{ filter: 'hue-rotate(-10deg)' }}
          />
        </div>
        <div className="w-50 mt-5 p-3 pb-5 border-start">
          <h2 className="text-center mt-3">Sign in for Ticketing.dev
          </h2>
          <form className="me-5 ms-5" onSubmit={handleSignUp}>
            <div>
              <label
                htmlFor="email"
                className="form-label mb-2 fs-4 text-body-secondary"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="form-control mb-4 border-dark-subtle"
                value={email}
                onChange={(e)=>{setEmail(e.target.value)}}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="form-label mb-2 fs-4 text-body-secondary"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="form-control mb-4 border-dark-subtle"
                value={password}
                onChange={(e)=>{setPassword(e.target.value)}}
              />
            </div>
            {errors}
            <div className="text-center mb-3">
              <button
                className="btn text-white fs-5 fw-bolder"
                style={{ background: '#009eb7', width: '100%' }}
                type="submit"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;
