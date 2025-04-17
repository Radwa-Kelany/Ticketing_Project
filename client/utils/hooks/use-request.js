import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ method, url, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);
  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const { data } = await axios[method](url, { ...body, ...props });
      onSuccess(data);
    } catch (error) {
      setErrors(
        <ul className="bg-warning-subtle border rounded">
          {error.response.data.errors.map((error) => {
            return (
              <li className="p-2" key={error.message}>
                {error.message}
              </li>
            );
          })}
        </ul>
      );
    }
  };

  return {
    errors,
    doRequest,
  };
};

export default useRequest;
