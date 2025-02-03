import { createContext, useContext, useState } from "react";

// Create Context
const ChatContext = createContext();

// Provider Component
export const ChatProvider = ({ children }) => {
    const [roomId, setRoomId] = useState("");
    const [currentUser, setCurrentUser] = useState("");
    const [connected, setConnected] = useState(false);

    return (
        <ChatContext.Provider value={{ roomId, setRoomId, currentUser, setCurrentUser, connected, setConnected }}>
            {children}
        </ChatContext.Provider>
    );
};

// Custom Hook to use ChatContext
const useChatContext = () => useContext(ChatContext);
export default useChatContext;



// useEffect(() => {
//     const connectWebSocket = () => {
//         const sock = new SockJS(`${baseUrl}/chat`);
//         const client = Stomp.over(sock);

//         client.connect({}, () => {
//             setStompClient(client);
//             toast.success("Connected");

//             client.subscribe(`/topic/room/${roomId}`, (message) => {
//                 console.log(message);
//                 const newMessage = JSON.parse(message.body);

//                 setMessages((prev) => [...prev, newMessage]);
//             });
//         });
//     };

//     connectWebSocket();
// }, [roomId]);