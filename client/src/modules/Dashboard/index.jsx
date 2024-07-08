import React from "react";
import usersvg from "../../assets/images/user.svg";
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
        <div className="flex items-center justify-center my-8 border-b   border-gray-300 pb-3">
          <div className="border-2 border-primary rounded-full">
            <img src={usersvg} width={50} height={50} />
          </div>
          <div className="ml-4">
            <h3 className="text-2xl">Aziz</h3>
            <p className="text-lg font-extralight">My Account</p>
          </div>
        </div>
        <div className="ml-14 mt-10">
          <div className="text-primary text-lg">Messages</div>
          <div className=" overflow-y-auto h-[520px] py-7 ">
            {contacts.map(({ name, status, img }) => {
              return (
                <div>
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
          <div className="w-3/4 bg-secondary h-[80px] mt-14  flex items-center rounded-full px-14 ">
            <div className=" rounded-full border border-blue-500">
              <img src={usersvg} width={35} height={35} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg ">Aziz</h3>
              <p className="text-sm font-light text-gray-600">Available</p>
            </div>
          </div>
              </div>
              <div className="h-3/4 w-full border overflow-y-auto">
                  <div className="h-[525px] ">
                      <div className=" h">
                          
                      </div>
                  </div>
              </div>
      </div>
      <div className="w-1/4 "></div>
    </div>
  );
};

export default Dashboard;
