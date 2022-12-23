import roomRepository from "@/repositories/room-repository";
import { notFoundError } from "@/errors";

async function getRoomInfo(roomId: number) {
  const room = await roomRepository.findById(roomId); 
  
  if (!room) {
    throw notFoundError();
  }
   
  return room;
}

const roomService = {
  getRoomInfo,
};

export default roomService;
