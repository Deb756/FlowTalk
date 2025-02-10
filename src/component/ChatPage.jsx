import React, { useEffect, useRef, useState } from 'react';
import sendSvg from '../assets/paper-plane.png';
import atachSvg from '../assets/paperclip.png';
import { useNavigate } from 'react-router-dom';
import useChatContext from '../contextApi/ChatContext';
import SockJS from 'sockjs-client';
import { baseUrl } from '../config/AxiosHelper';
import { Stomp } from '@stomp/stompjs';
import toast from 'react-hot-toast';
import { getMessages } from '../services/RoomService';
import { timeAgo } from './TimeStamp';

const ChatPage = ({ onLeave }) => {
    const { roomId, currentUser, connected, setConnected, setRoomId, setCurrentUser } = useChatContext();
    const inputRef = useRef(null);
    const chatBoxRef = useRef(null);
    const navigate = useNavigate();
    // for testing that connected or not
    // console.log(roomId);
    // console.log(currentUser);
    // console.log(connected);

    useEffect(() => {
        if (!connected) {
            navigate("/");
        }
    }, [connected, roomId, currentUser, navigate]);

    const [messages, setMessages] = useState([
        { sender: 'You', text: 'Hey! How are you?', time: '10:00 AM' },
        { sender: 'Alice', text: "I'm good! How about you?", time: '10:02 AM' },
        { sender: 'Alice', text: "I'm good! How about you?", time: '10:02 AM' },
        { sender: 'Alice', text: "I'm good! How about you?", time: '10:02 AM' },
        { sender: 'Alice', text: "I'm good! How about you?", time: '10:02 AM' },
        { sender: 'Alice', text: "I'm good! How about you?", time: '10:02 AM' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim()) {
            setMessages([...messages, { sender: 'You', content: input, time: new Date().toLocaleTimeString() }]);
            setInput('');
        }
    };
    const [StompClient, setStompClient] = useState(null);


    // handling / innitiating connection to server through StompClient
    useEffect(() => {
        const connectWebSocket = () => {
            const sock = new SockJS(`${baseUrl}/chat`);
            const client = Stomp.over(sock);

            client.connect({}, () => {
                setStompClient(client);
                toast.success("Connected");

                client.subscribe(`/topic/room/${roomId}`, (message) => {
                    console.log(message);
                    const newMessage = JSON.parse(message.body);

                    setMessages((prev) => [...prev, newMessage]);
                });
            });
        };

        if (connected) {
            connectWebSocket();
        }
    }, [roomId]);


    // sending massages
    const sendMessage = async () => {
        if (StompClient && connected && input.trim()) {
            console.log("Sending message:", input);

            // Creating the message object
            const message = {
                sender: currentUser,
                content: input,
                roomId: roomId,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            // Sending the message to the WebSocket topic
            StompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));

            // Updating local state to show the message instantly
            // setMessages((prev) => [...prev, message]);

            // Clearing input field after sending
            setInput("");
        }
    };


    // load all old new massages
    useEffect(() => {
        async function loadMessages() {
            try {
                const msg = await getMessages(roomId);
                // console.log(msg);
                setMessages(msg);

            } catch (error) {

            }
        }
        if (connected) {
            loadMessages();
        }
    }, [])

    // auto scroll down
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scroll({
                top: chatBoxRef.current.scrollHeight,
                behavior: "smooth",
            })
        }
    }, [messages])

    // logging out from chat app
    const handleLogout = () => {
        StompClient.disconnect();
        setConnected(false);
        setRoomId("");
        setCurrentUser("");

        navigate("/");
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-950 p-4">
            {/* Navbar */}
            <div className="flex items-center justify-between p-4  text-white shadow-md rounded-lg" style={{backgroundColor:'rgb(34 30 45)'}}>
                <div className='flex flex-wrap gap-4'>
                    <h2 className="text-lg font-semibold font-mono"> Room ID : {roomId}</h2>
                    <h2 className="text-lg font-semibold font-mono mx-2"> User : {currentUser}</h2>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600"
                >
                    Leave Chat
                </button>
            </div>

            {/* Chat Box */}
            <div ref={chatBoxRef} className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col items-center"
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'gray transparent' }}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex justify-start space-x-2 p-3 max-w-xs rounded-lg text-white w-fit ${msg.sender === currentUser ? ' self-end ml-auto' : ' self-start mr-auto'}`}
                    >
                        <img
                            src={`https://ui-avatars.com/api/?name=${msg.sender}&background=random`}
                            alt="avatar"
                            className="w-8 h-8 rounded-full"
                        />
                        <div>
                            <p className="text-sm font-semibold">{msg.sender}</p>
                            <p className={` rounded-lg m-2 p-2 ${msg.sender === currentUser ? 'bg-indigo-950' : 'bg-gray-700 '}`}>{msg.content}</p>
                            <span className="text-xs text-gray-300 block text-right">{timeAgo(msg.timeStamp)}</span>
                        </div>
                    </div>
                ))}
            </div>


            {/* Input Field */}
            <div className='flex mx-auto gap-1' style={{ width: '60vw' }}>
                <input
                    type="text"
                    className="flex-1 p-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()} 
                />
                <button onClick={handleSend} className="m-2">
                    <img src={atachSvg} style={{ height: '5vh' }} alt="Attach" />
                </button>
                <button onClick={sendMessage} className="m-2">
                    <img src={sendSvg} style={{ height: '6vh' }} alt="Send" />
                </button>
            </div>
        </div>
    );
};

export default ChatPage;
