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

export default function Nav({path}:{path:string}){
  console.log(path.substring(0,path.length-1))
  const pages = [
    {
      href:'/',
      title:'Home'
    },
    {
      href:'/projects',
      title:'Projects'
    },
    {
      href:'/writtens',
      title:'Writtens'
    },
    {
      href:'/work',
      title:'Work'
    },

  ]
  return (
    <div className="flex items-center justify-between space-y-4 max-sm:w-fit flex-col max-sm:mx-auto">
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
      <div className="overflow-hidden border-yellow-500/20 rounded-lg">
        <ul className="flex space-x-0.5 font-bold text-xs">
          {pages.map(page=>{
            return (
              <a className={`py-1.5 px-4 hover:bg-white/10 duration-200 ${page.href === path.substring(0,path.length-1) ? 'bg-white/10' : ''}`} href={page.href}>{page.title}</a>
            )
          })}
        </ul>
      </div>
{/* <BookMeet/> */}
    </div>
  )
}