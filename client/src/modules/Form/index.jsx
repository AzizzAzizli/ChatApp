import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { validateEmail } from "../../../utils";

const Form = ({ isSignInPage = false }) => {
  const [data, setData] = useState({
    ...(!isSignInPage && { fullname: "" }),
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();

    // if (data?.email.trim() !== "aziz" && data?.email.trim() !== "admin") {
    //

    //   // console.log(data.email);

    //   return
    // }
    const isValidEmail = validateEmail(data.email);
    if (!isValidEmail) {
      toast.warning("Please enter a valid email");
      return;
    }

    const res = await fetch(
      `http://localhost:3000/api/${isSignInPage ? "login" : "register"}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    console.log(res);
    const resData = await res.json();
    console.log(resData);
    if (resData.status === 400) {
      toast.warning(resData.message);
    } else if (resData.status === 201) {
      navigate("/users/sign_in")
      setData({})
      toast.success(resData.message);
    } else if (resData.token) {
      toast.success(resData.message);
      localStorage.setItem("user:token", JSON.stringify(resData.token));
      localStorage.setItem("user:detail", JSON.stringify(resData.user));
      setTimeout(() => {
        navigate("/");
      }, 750);
    }
  }
  return (
    <div className="bg-[#edf3fc] h-screen flex justify-center items-center ">
      <div className=" bg-white w-[500px] h-[600px] shadow-lg rounded-lg flex flex-col justify-center items-center">
        <div className="text-4xl font-extrabold ">
          Welcome {isSignInPage && "Back"}{" "}
        </div>
        <div className="text-xl font-light mb-14">
          {isSignInPage ? "Sign in to get explored" : " Sign up to get started"}
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col justify-center items-center"
        >
          {!isSignInPage && (
            <Input
              label="Full name"
              name="name"
              placeholder="Enter your full name"
              className="mb-6"
              value={data.fullname}
              onChange={(e) => setData({ ...data, fullname: e.target.value })}
            />
          )}
          <Input
            autocomplete="current-password"
            type="email"
            label="Email address"
            name="email"
            placeholder="Enter your email"
            className="mb-6"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <Input
            type="password"
            label="Password"
            name="password"
            placeholder="Enter your password"
            className="mb-10"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <Button
            type="submit"
            label={isSignInPage ? "Sign in" : "Sign up"}
            className="w-1/2 mb-2"
          />
        </form>

        <div>
          {isSignInPage
            ? "Didn't have an account? "
            : "Already have an account? "}
          <span
            onClick={() => {
              navigate(`/users/${isSignInPage ? "sign_up" : "sign_in"}`);
            }}
            className="text-primary cursor-pointer underline"
          >
            {isSignInPage ? "Sign up" : "Sign in"}
          </span>{" "}
        </div>
      </div>
    </div>
  );
};

export default Form;
