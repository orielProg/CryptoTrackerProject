const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));
import Register from '../components/Register';
import { render,queryByAttribute, fireEvent, screen, waitFor } from '@testing-library/react';
import { SnackbarProvider } from "notistack"
import axios from 'axios';


const getById = queryByAttribute.bind(null, 'id');
window.SVG = () => {};
global.window = { location: { pathname: null } };

describe(Register, () => {
    it("should register", async () => {
        jest.spyOn(axios, 'post').mockReturnValue(Promise.resolve({data: "aa"}))
        const dom = render(<SnackbarProvider><Register /></SnackbarProvider>);
        const emailInput = getById(dom.container, 'email');
        const usernameInput = getById(dom.container, 'username');
        const passwordInput = getById(dom.container, 'password');
        const confirmPasswordInput = getById(dom.container, 'confirmPassword');
        const submitButton = getById(dom.container, 'signup');
        fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
        fireEvent.change(usernameInput, { target: { value: 'test12' } });
        fireEvent.change(passwordInput, { target: { value: 'test123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'test123' } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText('Account created successfully, please login')).toBeInTheDocument()
        });
    });
});