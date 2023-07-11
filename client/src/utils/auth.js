import decode from 'jwt-decode'; // import decode from jwt-decode

class AuthService { // create a new class called AuthService
  getProfile() { // create a new method called getProfile()
    return decode(this.getToken()); // retrieve the token from localStorage and decode it using the jwt-decode package
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken(); // retrieve the token from localStorage
    return !!token && !this.isTokenExpired(token); // return a boolean value for whether or not the token is expired
  }

  isTokenExpired(token) { // create a new method called isTokenExpired() that accepts a token as a parameter
    try {
      const decoded = decode(token); // decode token
      if (decoded.exp < Date.now() / 1000) { // check if the token has expired
        return true; // return true if expired
      } else return false; // return false if not expired
    } catch (err) { // catch errors
      return false; // return false
    }
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token'); // retrieve the token from localStorage
  }

  login(idToken) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken); // save the token to localStorage

    window.location.assign('/'); // redirect to the home page
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token'); // remove the token from localStorage
    // this will reload the page and reset the state of the application
    window.location.assign('/'); // redirect to the home page
  }
}

export default new AuthService(); // export the AuthService class
