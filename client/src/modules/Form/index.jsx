import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

const Form = ({ isSignInPage = false }) => {
  const [data, setData] = useState({
    ...(!isSignInPage && { fullname: "" }),
    email: "",
    password: "",
  });
  const navigate = useNavigate()

  return (
    <div className="bg-[#edf3fc] h-screen flex justify-center items-center ">
 <div className=" bg-white w-[500px] h-[600px] shadow-lg rounded-lg flex flex-col justify-center items-center">
      <div className="text-4xl font-extrabold ">
        Welcome {isSignInPage && "Back"}{" "}
      </div>
      <div className="text-xl font-light mb-14">
        {isSignInPage ? "Sign in to get explored" : " Sign up to get started"}
          </div>
          
          <form onSubmit={()=>console.log(data)}  className="w-full flex flex-col justify-center items-center">
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
        label="Email address"
        name="email"
        placeholder="Enter your email"
        className="mb-6"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />
      <Input
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
          <span onClick={()=>{navigate(`/users/${isSignInPage ? "sign_up" : "sign_in"}`)}} className="text-primary cursor-pointer underline">
            
          {isSignInPage ? "Sign up" : "Sign in"}
        </span>{" "}
      </div>
    </div>
    </div>
   
  );
};

export default Form;
