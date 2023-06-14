import Login from "../components/Login";
import {
  render,
  queryByAttribute,
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react";
const getById = queryByAttribute.bind(null, "id");
import axios from "axios";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter

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
});
