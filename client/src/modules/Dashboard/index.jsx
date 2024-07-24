import React, { useEffect, useRef, useState } from "react";
import usersvg from "../../assets/images/user.svg";
import sendsvg from "../../assets/icons/send.svg";
import logoutsvg from "../../assets/icons/logout.svg";
import plussvg from "../../assets/icons/plus.svg"
import cancelsvg from "../../assets/icons/cancel.svg"
import Input from "../../components/Input";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const Dashboard = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage?.getItem("user:detail"))
  );
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({messages:[],receiver:{} , conversationId:""});
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);
const [isLeftBarOpen,setIsLeftBarOpen] = useState(false)

const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const newSocket = io("http://localhost:4040")
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);
  // console.log(messages);
  useEffect(() => {
    // console.log(socket);
    if (socket) {
      // console.log(user?.id);
      socket.emit("addUser", user?.id);
      socket.on("getUsers", (activeusers) => {
        // console.log("actives", activeusers);
      });

      socket.on("getMessage", (data) => {
        console.log(data);
        setMessages((prev) => ({
          ...prev,
          messages: [...prev?.messages, { user: data?.user, message: data?.message }],
        }));
      });
    }
  }, [socket]);
  // console.log(messages, "messages");

  function logOut() {
    localStorage.removeItem("user:detail");
    localStorage.removeItem("user:token");
    toast.success("Logged out successfully");
    setTimeout(() => {
      window.location.reload();
    }, 750);
  }

  async function fetchConversations() {
    const loggedInUser = JSON.parse(localStorage.getItem("user:detail"));

    const res = await fetch(
      `http://localhost:3000/api/conversations/${loggedInUser?.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const resData = await res.json();
    // console.log(resData, "conversations");
    setConversations(resData);
  }
  // console.log(conversations,"conversations");
  async function fetchMessages(conversationId, receiver) {
    const res = await fetch(
      `http://localhost:3000/api/message/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.receiverId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const resData = await res.json();
    // console.log(resData,"messageRes");
    setMessages({ messages: resData, receiver, conversationId });
  }
  console.log(messages,"messages");

  async function sendMessage() {
    socket.emit("sendMessage", {
      conversationId: messages?.conversationId,
      senderId: user?.id,
      message,
      receiverId: messages?.receiver?.receiverId,
    });

    // console.log(message);
    const res = await fetch(`http://localhost:3000/api/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId: messages?.conversationId,
        senderId: user?.id,
        message,
        receiverId: messages?.receiver?.receiverId,
      }),
    });
    const resData = await res.json();
    // console.log(resData);
    setMessage("");
  }

  useEffect(() => {
    fetchConversations();
  }, []);

  async function fetchUsers() {
    const res = await fetch(`http://localhost:3000/api/users/${user.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resData = await res.json();
    setUsers(resData);
  }
  // console.log(users,"users")

  useEffect(() => {
    fetchUsers();
  }, []);

  // console.log(user);
  return (
    <div className="w-full h-screen flex ">
      <div className="w-1/3  md:w-1/4  h-full  bg-secondary  ">
        <div className="flex items-center justify-center my-4 border-b   border-gray-300 pb-3">
          <div className="border-2 border-primary rounded-full">
            <img className="w-[35px] md:w-[50px]"  src={usersvg} alt="usersvg"  />
          </div>
          <div className="ml-4">
            <h3 className="text-lg sm:text-2xl">{user.fullname}</h3>
            <p className="text-xs sm:text-lg font-extralight">My Account</p>
          </div>
          <div onClick={logOut} className=" ml-5 cursor-pointer">
            <img className="w-[25px] sm:w-[35px]" width={35} height={35} src={logoutsvg} alt="logoutsvg" />
          </div>
        </div>
        <div className="ml-2 mt-5 md:mt-10 ">
          <div className="flex items-center justify-between">
          <div className="text-primary text-sm sm:text-lg  ">Messages</div>
            <div className="block md:hidden"><img onClick={()=>setIsLeftBarOpen(prev=>!prev)} width={20} height={20} src={plussvg} alt="plus" /></div> </div>
          
          <div className=" overflow-y-auto  py-3 md:py-7 ">
            {conversations.length > 0 ? (
              conversations.map(({ conversationId, user }, index) => {
                // console.log(user);
                return (
                  <div key={conversationId + index}>
                    <div
                      className="flex items-center cursor-pointer   py-4 md:py-8 border-b border-b-gray-500 "
                      onClick={() => fetchMessages(conversationId, user)}
                    >
                      <div className=" rounded-full border border-gray-500">
                        <img src={usersvg} width={35} height={35} />
                      </div>
                      <div className="ml-2">
                        <h3 className="text-sm sm:text-lg font-semibold">
                          {user?.fullname}
                        </h3>
                        <p className="text-xs sm:text-sm font-extralight text-gray-600">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-sm md:text-lg  font-semibold mt-24">
                No Conversations
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-2/3 md:w-1/2 h-full bg-white  ">
        <div className="flex w-full justify-center">
          {messages?.receiver?.fullname && (
            <div className="w-3/4 bg-secondary h-[50px] md:h-[80px] mt-3 md:mt-10  flex items-center rounded-full px-7 md:px-14 ">
              <div className=" rounded-full border border-blue-500">
                <img src={usersvg} width={35} height={35} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm sm:text-lg ">{messages?.receiver?.fullname}</h3>
                <p className="text-xs sm:text-sm font-light text-gray-600">
                  {messages?.receiver?.email}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="h-3/4 w-full  overflow-y-auto">
          <div className="h-full py-4 px-1 sm:px-3">
            {messages?.conversationId !==""? (
              messages?.messages?.map(
                ({ message, user: { id, fullname } = {} }, index) => {
                  if (id === user.id) {
                    return (
                      <div
                        key={index + 1 + ") " + message}
                        className="flex justify-end mb-4"
                      >
                        <div className=" bg-primary text-white rounded-tr-none  rounded-lg p-3 max-w-xs overflow-x-auto break-words">
                          <p className="whitespace-pre-wrap text-sm sm:text-lg">{message}</p>
                          <div className="text-right text-xs mt-2">
                            <p>{id === user.id ? "You" : fullname}</p>
                          </div>
                        </div>
                        <div ref={bottomRef}></div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={index + 1 + ") " + message}
                        className="flex justify-start mb-4"
                      >
                        <div className=" bg-gray-300 text-gray-700 rounded-tl-none  rounded-lg p-3 max-w-xs overflow-x-auto break-words">
                          <p className="whitespace-pre-wrap">{message}</p>
                          <div className="text-right text-xs mt-2">
                            <p>{fullname}</p>
                          </div>
                        </div>
                        <div ref={bottomRef}></div>
                      </div>
                    );
                  }
                }
              )
            ) : (
              <div className="text-center text-sm md:text-lg font-semibold mt-24 ">
                {" "}
                No Messages
              </div>
            )}
          </div>
        </div>
        {messages?.receiver?.fullname && (
          <div className="flex w-full items-center ml-4">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              containerClassName="w-3/4"
              className=""
              placeholder="Type a message ..."
            />
            <div
              onClick={sendMessage}
              className={` ml-4 cursor-pointer  ${
                !message && "pointer-events-none"
              }`}
            >
              <img className=" w-[22px] sm:w-[30px]" src={sendsvg} height={30} width={30} alt="sendbutton" />
            </div>
          </div>
        )}
      </div>

      <div className="w-1/3  md:w-1/4 h-full bg-light hidden md:block ">
        <div className="text-primary text-sm md:text-lg  pl-2 pt-5">New people</div>
        <div className=" overflow-y-auto  py-2 pl-2 ">
          {users.length > 0 ? (
            users.map(({ user }) => {
              return (
                <div key={user?.receiverId}>
                  <div
                    className="flex items-center cursor-pointer  py-4 md:py-8 border-b border-b-gray-500 "
                    onClick={() => fetchMessages("new", user)}
                  >
                    <div className=" rounded-full border border-gray-500">
                      <img src={usersvg} width={35} height={35} />
                    </div>
                    <div className="ml-2">
                      <h3 className="text-sm md:text-lg font-semibold">
                        {user?.fullname}
                      </h3>
                      <p className="text-xs md:text-sm font-extralight text-gray-600">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-lg  font-semibold mt-24">
              No Users
            </div>
          )}
        </div>
      </div>
      <div  className={`w-1/3  md:w-1/4 h-full bg-light ease-linear transition-all duration-500 fixed top-0 ${isLeftBarOpen?"left-0":"left-[-100%]"}  md:hidden `}>
        <div>
          <img onClick={()=>setIsLeftBarOpen(prev=>!prev)}className="absolute top-0 right-0"  src={cancelsvg} width={25} height={25} alt="cancel" />
        </div>
        <div className="text-primary text-sm md:text-lg  pl-2 pt-5">New people</div>
        <div className=" overflow-y-auto  py-2 pl-2 ">
          {users.length > 0 ? (
            users.map(({ user }) => {
              return (
                <div key={user?.receiverId}>
                  <div
                    className="flex items-center cursor-pointer  py-4 md:py-8 border-b border-b-gray-500 "
                    onClick={() => fetchMessages("new", user)}
                  >
                    <div className=" rounded-full border border-gray-500">
                      <img src={usersvg} width={35} height={35} />
                    </div>
                    <div className="ml-2">
                      <h3 className="text-sm md:text-lg font-semibold">
                        {user?.fullname}
                      </h3>
                      <p className="text-xs md:text-sm font-extralight text-gray-600">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-lg  font-semibold mt-24">
              No Users
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
