import profilePictureUrl from "../assets/profile-picture.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const Header = () => {
  return (
    <header className="flex justify-between items-center py-3 px-3 bg-primary">
      <span className="text-primary-foreground font-bold">BimBamJob</span>
      <Avatar className="size-10">
        <AvatarImage src={profilePictureUrl} />
        <AvatarFallback>BL</AvatarFallback>
      </Avatar>
    </header>
  );
};
