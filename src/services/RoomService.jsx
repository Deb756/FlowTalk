import { httpClient } from "../config/AxiosHelper"

export const createRoom = async (roomDeatil) => {
    const response = await httpClient.post('/api/rooms', roomDeatil, {
        headers: {
            "Content-Type": 'text/plain'
        }
    });
    return response.data;
};

export const joinChatApi = async (roomId) => {
    const respose = await httpClient.get(`/api/rooms/${roomId}`);
    return respose.data;
}

export const getMessages = async (roomId, size = 50, page = 0) => {
    console.log('roomId:', roomId);  // Debugging line
    if (!roomId) {
        console.error('Room ID is missing');
        return;  // Exit the function early if roomId is not provided
    }

    const response = await httpClient.get(`/api/rooms/${roomId}/massages?size=${size}&page=${page}`);
    return response.data;
};
