import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type ExperienceProps = {
  company:string,
  title:string,
  start:string,
  end: string,
  description: string,
  stack: string,
  location: string,

} 
export default function WorkCard({experience}:{experience:ExperienceProps}){
  const techstack = experience.stack.trim().split(',')
  return (
    <div className="bg-slate-500/10 rounded-lg relative w-full border-yellow-500/20 px-2 py-2 space-y-2">
      <div className="flex justify-between text-gray-200/40 text-xs">
        <div>{experience.location}</div>
        <div>{experience.start} - {experience.end}</div>
      </div>
      <div>
        <h1>{experience.title} <span className="text-gray-200/40">at </span>{experience.company}</h1>
      </div>
      <div>
        <p className="text-xs text-gray-200/60">{experience.description}</p>
      </div>
      <ul className="flex justify-start flex-wrap gap-y-1 relative text-[10px] font-light space-x-2">
        {techstack.map(tech=>{
          return <li className="border bg-white/5 border-yellow-500/20 py-0.5 px-1.5 rounded-xl">{tech}</li>
        })}
      </ul>
    </div>
  )
}