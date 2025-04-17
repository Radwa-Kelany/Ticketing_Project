import Link from 'next/link';
import Image from 'next/image';
import signup from '../../public/images/signup.webp';
import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import useRequest from '../../utils/hooks/use-request';

const SignUp = () => {
  const router = useRouter();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { errors, doRequest } = useRequest({
    method: 'post',
    url: '/api/v1/auth/signup',
    body: {
      username,
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
          <h2 className="text-center mt-3">Sign up for Ticketing.dev</h2>
          <form className="me-5 ms-5" onSubmit={handleSignUp}>
            <div>
              <label
                htmlFor="username"
                className="form-label mb-2 fs-4 text-body-secondary"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                className="form-control mb-4 border-dark-subtle"
                value={username}
                onChange={(e)=>{setUsername(e.target.value)}}
              />
            </div>
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
                Sign up
              </button>
            </div>
            <div className="d-flex justify-content-sm-around">
              <hr className="w-50 bg-dark" style={{ height: '1px' }} />
              <h5 className="ms-5 me-5">OR</h5>
              <hr className="w-50 bg-dark" style={{ height: '1px' }} />
            </div>
            <div className="text-center border border-dark-subtle rounded mt-3">
              <button
                className="btn text-dark fs-5 fw-semibold"
                style={{ width: '300px' }}
              >
                <Link className="nav-link" href="/auth/signin">
                  Sign in to an existing account
                </Link>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
