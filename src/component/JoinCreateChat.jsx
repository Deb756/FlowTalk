import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { createRoom, joinChatApi } from '../services/RoomService';

import { useNavigate } from 'react-router-dom';
import useChatContext from '../contextApi/ChatContext';


const JoinCreateChat = () => {
    const [details, setDetails] = useState({
        roomId: "",
        userName: "",
    });

    const { roomId, setRoomId, currentUser, setCurrentUser, setConnected, connected } = useChatContext();
    const navigate = useNavigate();

    const handleFormInputChanges = (event) => {
        setDetails({
            ...details,
            [event.target.name]: event.target.value,  // Fixed typo: "naame" -> "name"
        });
    };

    const validateForm = () => {
        if (details.roomId.trim() === "" || details.userName.trim() === "") {
            toast.error("Invalid Inputs !!");
            return false;
        }
        return true;
    };

    const handleJoinRoom = async () => {
        if (!validateForm()) return;
        // join chat
        // toast.success(`Joining Room: ${details.roomId} as ${details.userName}`);

        try {
            const room = await joinChatApi(details.roomId);
            toast.success("Join Success!!");
            setCurrentUser(details.userName);
            setRoomId(details.roomId);
            setConnected(true);
            console.log(roomId);
            
            // forward to chat page
            navigate('/chat')
        } catch (error) {
            if (error.status === 400) {
                toast.error("Error Joining Room !!")
            }
            else {
                toast.error("Error in Joining room !!")
                console.log(error);
            }
        }
    };

    const handleCreateRoom = async () => {
        if (!validateForm()) return;

        // toast.success(`Creating Room with ID: ${details.roomId} for ${details.userName}`);
        console.log(details);

        try {
            const response = await createRoom(details.roomId);
            console.log(response);
            toast.success("room created successfully");
            // join chat room
            setCurrentUser(details.userName);
            setRoomId(response.roomId);
            setConnected(true);
            // forward to chat page

            navigate('/chat')

        } catch (error) {
            console.log(error);
            if (error.status == 400) {
                toast.error("Room Already Exist !!")
            }
            else {

                toast.error("error in creating room");
            }

        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
            <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-lg w-[30rem]">
                <h2 className="text-3xl font-semibold text-center text-gray-700 dark:text-gray-200 mb-6">
                    Chat - App
                </h2>
                <div className="mb-4">
                    <label className="block text-gray-600 font-bold dark:text-gray-300 mb-1" htmlFor="name">Your Name</label>
                    <input
                        type="text"
                        id='name'
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter your name"
                        name='userName'
                        value={details.userName}
                        onChange={handleFormInputChanges}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-600 font-bold dark:text-gray-300 mb-1" htmlFor="roomId">Room ID</label>
                    <input
                        type="text"
                        id='roomId'
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter Room ID"
                        name='roomId'
                        value={details.roomId}
                        onChange={handleFormInputChanges}
                    />
                </div>
                <div className="flex justify-between">
                    <button
                        className="bg-blue-500 text-white px-5 py-3 font-bold rounded-lg hover:bg-blue-600 transition w-1/2 mr-2"
                        onClick={handleJoinRoom}
                    >
                        Join Room
                    </button>
                    <button
                        className="bg-green-500 text-white px-5 py-3 font-bold rounded-lg hover:bg-green-600 transition w-1/2 ml-2"
                        onClick={handleCreateRoom}
                    >
                        Create Room
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JoinCreateChat;
