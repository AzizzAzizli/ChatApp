import React, { useEffect, useState } from "react";
import usersvg from "../../assets/images/user.svg";
import sendsvg from "../../assets/icons/send.svg";
import logoutsvg from "../../assets/icons/logout.svg";
import Input from "../../components/Input";
import { toast } from "react-toastify";
const Dashboard = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user:detail"))
  );
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);

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
    setMessages({ messages: resData, receiver: receiver, conversationId });
  }

  async function sendMessage() {
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
    console.log(resData);
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

  useEffect(() => {
    fetchUsers();
    // console.log(users)
  }, []);

  // console.log(user);
  return (
    <div className="w-full h-screen flex ">
      <div className="w-1/4  bg-secondary">
        <div className="flex items-center justify-center my-6 border-b   border-gray-300 pb-3">
          <div className="border-2 border-primary rounded-full">
            <img src={usersvg} width={50} height={50} />
          </div>
          <div className="ml-4">
            <h3 className="text-2xl">{user.fullname}</h3>
            <p className="text-lg font-extralight">My Account</p>
          </div>
          <div onClick={logOut} className=" ml-5 cursor-pointer">
            <img width={35} height={35} src={logoutsvg} alt="logoutsvg" />
          </div>
        </div>
        <div className="ml-14 mt-10 h-3/4">
          <div className="text-primary text-lg">Messages</div>
          <div className=" overflow-y-auto h-full py-7 ">
            {conversations.length > 0 ? (
              conversations.map(({ conversationId, user }, index) => {
                return (
                  <div key={user?.email}>
                    <div
                      className="flex items-center cursor-pointer  py-8 border-b border-b-gray-500 "
                      onClick={() => fetchMessages(conversationId, user)}
                    >
                      <div className=" rounded-full border border-gray-500">
                        <img src={usersvg} width={35} height={35} />
                      </div>
                      <div className="ml-2">
                        <h3 className="text-lg font-semibold">
                          {user?.fullname}
                        </h3>
                        <p className="text-sm font-extralight text-gray-600">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-lg  font-semibold mt-24">
                No Conversations
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-1/2 bg-white ">
        <div className="flex w-full justify-center">
          {messages?.receiver?.fullname && (
            <div className="w-3/4 bg-secondary h-[80px] mt-10  flex items-center rounded-full px-14 ">
              <div className=" rounded-full border border-blue-500">
                <img src={usersvg} width={35} height={35} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg ">{messages?.receiver?.fullname}</h3>
                <p className="text-sm font-light text-gray-600">
                  {messages?.receiver?.email}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="h-3/4 w-full  overflow-y-auto">
          <div className="h-full py-4 px-3">
            {messages?.messages?.length > 0 ? (
              messages?.messages?.map(
                ({ message, user: { id, fullname } }, index) => {
                  if (id === user.id) {
                    return (
                      <div
                        key={index + 1 + ") " + message}
                        className="flex justify-end mb-4"
                      >
                        <div className=" bg-primary text-white rounded-tr-none  rounded-lg p-3 max-w-xs overflow-x-auto break-words">
                          <p className="whitespace-pre-wrap">{message}</p>
                          <div className="text-right text-xs mt-2">
                            <p>{id === user.id ? "You" : fullname}</p>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="flex justify-start mb-4">
                        <div className=" bg-gray-300 text-gray-700 rounded-tl-none  rounded-lg p-3 max-w-xs overflow-x-auto break-words">
                          <p className="whitespace-pre-wrap">{message}</p>
                          <div className="text-right text-xs mt-2">
                            <p>{fullname}</p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                }
              )
            ) : (
              <div className="text-center text-lg font-semibold mt-24 ">
                {" "}
                No Messages
              </div>
            )}
            {/* Left */}
            {/* <div className="flex justify-start mb-4">
              <div className=" bg-gray-300 text-gray-700 rounded-tl-none  rounded-lg p-3 max-w-xs overflow-x-auto break-words">
                <p className="whitespace-pre-wrap">
                  Salammmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
                </p>
                <div className="text-right text-xs mt-2">
                  <p>12/05/2024</p>
                </div>
              </div>
            </div> */}
            {/* Right */}
            {/* <div className="flex justify-end mb-4">
              <div className=" bg-primary text-white rounded-tr-none  rounded-lg p-3 max-w-xs overflow-x-auto break-words">
                <p className="whitespace-pre-wrap">Salammmmmmmmmmmmmmmmm</p>
                <div className="text-right text-xs mt-2">
                  <p>12/05/2024</p>
                </div>
              </div>
            </div> */}
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
              <img src={sendsvg} height={30} width={30} alt="sendbutton" />
            </div>
          </div>
        )}
      </div>

      <div className="w-1/4 h-screen bg-light ">
        <div className="text-primary text-lg px-8 pl-7">People</div>
        <div className=" overflow-y-auto h-full py-2 pl-7 ">
          {users.length > 0 ? (
            users.map(({ userId, user }, index) => {
              return (
                <div key={user?.email}>
                  <div
                    className="flex items-center cursor-pointer  py-8 border-b border-b-gray-500 "
                    onClick={() => fetchMessages("new", user)}
                  >
                    <div className=" rounded-full border border-gray-500">
                      <img src={usersvg} width={35} height={35} />
                    </div>
                    <div className="ml-2">
                      <h3 className="text-lg font-semibold">
                        {user?.fullname}
                      </h3>
                      <p className="text-sm font-extralight text-gray-600">
                        {user.email}
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
