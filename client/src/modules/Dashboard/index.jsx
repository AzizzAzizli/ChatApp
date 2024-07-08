import React from "react";
import usersvg from "../../assets/images/user.svg";
import sendsvg from "../../assets/icons/send.svg";

import Input from "../../components/Input";
const Dashboard = () => {
  const contacts = [
    {
      name: "Aziz",
      status: "Available",
      img: usersvg,
    },
    {
      name: "Aziz",
      status: "Available",
      img: usersvg,
    },
    {
      name: "Aziz",
      status: "Available",
      img: usersvg,
    },
    {
      name: "Aziz",
      status: "Available",
      img: usersvg,
    },
    {
      name: "Aziz",
      status: "Available",
      img: usersvg,
    },
    {
      name: "Aziz",
      status: "Available",
      img: usersvg,
    },
  ];
  return (
    <div className="w-full h-screen flex ">
      <div className="w-1/4  bg-secondary">
        <div className="flex items-center justify-center my-6 border-b   border-gray-300 pb-3">
          <div className="border-2 border-primary rounded-full">
            <img src={usersvg} width={50} height={50} />
          </div>
          <div className="ml-4">
            <h3 className="text-2xl">Aziz</h3>
            <p className="text-lg font-extralight">My Account</p>
          </div>
        </div>
        <div className="ml-14 mt-10 h-3/4">
          <div className="text-primary text-lg">Messages</div>
          <div className=" overflow-y-auto h-full py-7 ">
            {contacts.map(({ name, status, img },index) => {
              return (
                <div  key={name+index}>
                  <div className="flex items-center cursor-pointer  py-8 border-b border-b-gra-500 ">
                    <div className=" rounded-full border border-gray-500">
                      <img src={img} width={35} height={35} />
                    </div>
                    <div className="ml-2">
                      <h3 className="text-lg font-semibold">{name}</h3>
                      <p className="text-sm font-extralight text-gray-600">
                        {status}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="w-1/2 bg-white ">
        <div className="flex w-full justify-center">
          <div className="w-3/4 bg-secondary h-[80px] mt-10  flex items-center rounded-full px-14 ">
            <div className=" rounded-full border border-blue-500">
              <img src={usersvg} width={35} height={35} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg ">Aziz</h3>
              <p className="text-sm font-light text-gray-600">Available</p>
            </div>
          </div>
        </div>
        <div className="h-3/4 w-full  overflow-y-auto">
          <div className="h-full py-4 px-3">
            {/* Left */}
            <div className="flex justify-start mb-4">
              <div className=" bg-gray-300 text-gray-700 rounded-tl-none  rounded-lg p-3 max-w-xs overflow-x-auto break-words">
                <p className="whitespace-pre-wrap">
                  Salammmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
                </p>
                <div className="text-right text-xs mt-2">
                  <p>12/05/024</p>
                </div>
              </div>
            </div>
            {/* Right */}
            <div className="flex justify-end mb-4">
              <div className=" bg-primary text-white rounded-tr-none  rounded-lg p-3 max-w-xs overflow-x-auto break-words">
                <p className="whitespace-pre-wrap">Salammmmmmmmmmmmmmmmm</p>
                <div className="text-right text-xs mt-2">
                  <p>12/05/024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center ml-4">
                  <Input containerClassName="w-3/4"  className="" placeholder="Type a message ..." />
                  <div className="ml-4 "><img src={sendsvg} height={30} width={30} className="cursor-pointer" alt="sendbutton" /></div>
        </div>
      </div>

      <div className="w-1/4 h-screen"></div>
    </div>
  );
};

export default Dashboard;
