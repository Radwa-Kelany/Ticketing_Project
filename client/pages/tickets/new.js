import useRequest from '../../utils/hooks/use-request';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
const NewTicket = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const { errors, doRequest } = useRequest({
    method: 'post',
    url: '/api/v1/tickets',
    body: {
      title,
      price,
    },
    onSuccess: () => {
      router.push('/');
    },
  });
  async function handleTicket(e) {
    e.preventDefault();
    await doRequest();
  }

  function handleBlur() {
    const value = parseFloat(price).toFixed(2);
    if (isNaN(value)) {
      return;
    }
    setPrice(value);
  }
  return (
    <div className="w-50 m-auto p-5">
      <h2 className="text-center mt-3 mb-3">Create a Ticket</h2>
      <form className="me-5 ms-5 border rounded p-5" onSubmit={handleTicket}>
        <div>
          <label
            htmlFor="title"
            className="form-label mb-2 fs-4 text-body-secondary"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="form-control mb-4 border-dark-subtle"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div>
          <label
            htmlFor="price"
            className="form-label mb-2 fs-4 text-body-secondary"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            required
            className="form-control mb-4 border-dark-subtle"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            onBlur={handleBlur}
          />
        </div>
        {errors}
        <button
          className="btn text-white fs-5 fw-bolder"
          style={{ background: '#009eb7', width: '30%' }}
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
export default NewTicket;
