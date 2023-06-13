import Login from "../components/Login";
import {
  render,
  queryByAttribute,
  fireEvent,
  screen,
} from "@testing-library/react";
const getById = queryByAttribute.bind(null, "id");
window.SVG = () => {};

describe(Login, () => {
  it("should return detailed error message if user enters invalid credentials", () => {
    const dom = render(<Login />);
    const emailInput = getById(dom.container, "email");
    const passwordInput = getById(dom.container, "password");
    fireEvent.change(emailInput, { target: { value: "test" } });
    fireEvent.change(passwordInput, { target: { value: "test" } });
    expect(
      screen.getByText('"Email" length must be at least 6 characters long')
    ).toBeInTheDocument();
    expect(
      screen.getByText('"Password" length must be at least 6 characters long')
    ).toBeInTheDocument();
  });

  it("should login to the application", async () => {
    jest.spyOn(axios, "post").mockReturnValue(
      Promise.resolve({
        body: { data: "Logged" },
        headers: [
          [
            "set-cookie",
            "accessToken=test; Max-Age=1800; Path=/; Expires=Sat, 10 Jun 2023 21:23:00 GMT; HttpOnly",
          ],
          [
            "set-cookie",
            "refreshToken=test; Max-Age=1800; Path=/; Expires=Sat, 10 Jun 2023 21:23:00 GMT; HttpOnly",
          ],
          [
            "set-cookie",
            "loggedIn=true; Max-Age=1800; Path=/; Expires=Sat, 10 Jun 2023 21:23:00 GMT; HttpOnly",
          ],
        ],
      })
    );
    const dom = render(<Login />);
    const emailInput = getById(dom.container, "email");
    const passwordInput = getById(dom.container, "password");
    const loginButton = getById(dom.container, "signin");
    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "test1234" } });
    fireEvent.click(loginButton);
    await waitFor(() => {
        
    });
  });
});
