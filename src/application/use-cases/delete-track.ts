import { IUserRepository } from "../repositories/user.repository.interface";

export const deleteTrackUseCases = async (
  { userRepository }: { userRepository: IUserRepository },
  { trackId }: { trackId: number },
) => {
  const { data: loggedUser } = await userRepository.getUser();
  if (!loggedUser) {
    throw new Error("Unauthenticate Error");
  }

  console.log(trackId, loggedUser);

  const { success, deleteCurrentListenerMessage } =
    await userRepository.deleteCurrentListener(loggedUser.id, trackId);
  if (!success) {
    throw new Error(deleteCurrentListenerMessage);
  }

  return "트랙 삭제 완료";
};
