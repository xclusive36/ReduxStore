import React, { useState } from 'react'; // import React and useState hook
import { useMutation } from '@apollo/client'; // import useMutation from @apollo/client
import { Link } from 'react-router-dom'; // import Link from react-router-dom
import { LOGIN } from '../utils/mutations'; // import LOGIN from utils/mutations
import Auth from '../utils/auth'; // import Auth from utils/auth

function Login(props) { // define Login component with props as argument
  const [formState, setFormState] = useState({ email: '', password: '' }); // set formState and setFormState to useState with { email: '', password: '' } as argument
  const [login, { error }] = useMutation(LOGIN); // set login and error to useMutation with LOGIN as argument

  const handleFormSubmit = async (event) => { // define handleFormSubmit function with event as argument
    event.preventDefault(); // prevent default event behavior
    try {
      const mutationResponse = await login({ // set mutationResponse to await login with { email: formState.email, password: formState.password } as argument
        variables: { email: formState.email, password: formState.password }, // set variables to { email: formState.email, password: formState.password }
      });
      const token = mutationResponse.data.login.token; // set token to mutationResponse.data.login.token
      Auth.login(token); // call Auth.login with token as argument
    } catch (e) { // catch errors
      console.log(e); // log errors
    }
  };

  const handleChange = (event) => { // define handleChange function with event as argument
    const { name, value } = event.target; // destructure name and value from event.target
    setFormState({ // call setFormState
      ...formState, // spread formState
      [name]: value, // set [name] to value
    });
  };

  return (
    <div className="container my-1">
      <Link to="/signup">← Go to Signup</Link>

      <h2>Login</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="flex-row space-between my-2">
          <label htmlFor="email">Email address:</label>
          <input
            placeholder="youremail@test.com"
            name="email"
            type="email"
            id="email"
            onChange={handleChange}
          />
        </div>
        <div className="flex-row space-between my-2">
          <label htmlFor="pwd">Password:</label>
          <input
            placeholder="******"
            name="password"
            type="password"
            id="pwd"
            onChange={handleChange}
          />
        </div>
        {error ? (
          <div>
            <p className="error-text">The provided credentials are incorrect</p>
          </div>
        ) : null}
        <div className="flex-row flex-end">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default Login; // export Login component
