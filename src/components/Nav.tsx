import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import BookMeet from "./BookMeet"

export default function Nav(){
  return (
    <div className="flex items-center justify-between max-sm:space-y-4 max-sm:w-fit max-sm:flex-col max-sm:mx-auto">
      <div className="flex space-x-2 items-center">
      <Avatar className="size-14">
  <AvatarImage src="https://github.com/mahmoudgalalz.png" />
  <AvatarFallback>K</AvatarFallback>
</Avatar>
<div>
<h1 className="font-bold text-lg">Mahmoud Galal <span className="font-light opacity-70 text-xs">aka <span className=" text-yellow-600">KroKing</span></span></h1>
<b className="opacity-70 font-medium text-sm">Software Engineer and Open source contributor</b>
</div>
      </div>
      <Menubar >
  <MenubarMenu>
    <MenubarTrigger>Projects</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        New Tab <MenubarShortcut>⌘T</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>New Window</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Share</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Print</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenubarTrigger>Writtens</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        New Tab <MenubarShortcut>⌘T</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>New Window</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Share</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Print</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenubarTrigger>Experiences</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        New Tab <MenubarShortcut>⌘T</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>New Window</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Share</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Print</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
{/* <BookMeet/> */}
    </div>
  )
}