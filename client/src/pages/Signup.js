import React, { useState } from 'react'; // import React and useState hook
import { Link } from 'react-router-dom'; // import Link from react-router-dom
import { useMutation } from '@apollo/client'; // import useMutation from @apollo/client
import Auth from '../utils/auth'; // import Auth from utils/auth
import { ADD_USER } from '../utils/mutations'; // import ADD_USER from utils/mutations

function Signup(props) { // define Signup component with props as argument
  const [formState, setFormState] = useState({ email: '', password: '' }); // set formState and setFormState to useState with { email: '', password: '' } as argument
  const [addUser] = useMutation(ADD_USER); // set addUser to useMutation with ADD_USER as argument

  const handleFormSubmit = async (event) => { // define handleFormSubmit function with event as argument
    event.preventDefault(); // prevent default event behavior
    const mutationResponse = await addUser({ // set mutationResponse to await addUser with { email: formState.email, password: formState.password, firstName: formState.firstName, lastName: formState.lastName } as argument
      variables: { // set variables to { email: formState.email, password: formState.password, firstName: formState.firstName, lastName: formState.lastName }
        email: formState.email,
        password: formState.password,
        firstName: formState.firstName,
        lastName: formState.lastName,
      },
    });
    const token = mutationResponse.data.addUser.token; // set token to mutationResponse.data.addUser.token
    Auth.login(token); // call Auth.login with token as argument
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
      <Link to="/login">← Go to Login</Link>

      <h2>Signup</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="flex-row space-between my-2">
          <label htmlFor="firstName">First Name:</label>
          <input
            placeholder="First"
            name="firstName"
            type="firstName"
            id="firstName"
            onChange={handleChange}
          />
        </div>
        <div className="flex-row space-between my-2">
          <label htmlFor="lastName">Last Name:</label>
          <input
            placeholder="Last"
            name="lastName"
            type="lastName"
            id="lastName"
            onChange={handleChange}
          />
        </div>
        <div className="flex-row space-between my-2">
          <label htmlFor="email">Email:</label>
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
        <div className="flex-row flex-end">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default Signup; // export Signup
