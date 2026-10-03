import { IUserRepository } from "../repositories/user.repository.interface";

export const deleteTrackUseCase = async (
  { userRepository }: { userRepository: IUserRepository },
  { trackId }: { trackId: number },
) => {
  if (!trackId) {
    throw new Error("Not Found Track ID");
  }

  const { data: loggedUser } = await userRepository.getUser();
  if (!loggedUser) {
    throw new Error("Unauthenticate Error");
  }

  const { success, deleteCurrentListenerMessage } =
    await userRepository.deleteCurrentListener(loggedUser.id, trackId);
  if (!success) {
    throw new Error(deleteCurrentListenerMessage);
  }

  return "트랙 삭제 완료";
};
