export const logout = () => (dispatch) => {
    // 1. Clear physical storage
    localStorage.removeItem('token');
    
    // 2. Clear Redux memory
    dispatch({ type: 'LOGOUT_SUCCESS' });

    // 3. Optional: Clear specific local storage keys if you use them
    // localStorage.removeItem('cart'); 

    // 4. Force a hard redirect to the login page to reset the React tree
    window.location.href = '/login';
};