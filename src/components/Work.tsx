import { useState } from "react";

export type ExperienceProps = {
  company:string,
  title:string,
  start:string,
  end: string,
  description: string,
  stack: string,
  location: string,
  contributions: string[],
} 
export default function WorkCard({experience}:{experience:ExperienceProps}){
  const techstack = experience.stack.trim().split(',')
  const [showContributions, setShowContributions] = useState(false);

  const toggleContributions = () => {
    setShowContributions(prevState => !prevState);
  };
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
        <p className="text-xs text-gray-200/60 leading-5">{experience.description}</p>
      </div>
      <ul className="flex justify-start flex-wrap gap-y-1 relative text-[10px] font-light space-x-2">
        {techstack.map(tech=>{
          return <li className="border bg-white/5 text-white/70 border-yellow-500/20 py-0.5 px-1.5 rounded-xl">{tech}</li>
        })}
      </ul>
      { !showContributions && <div onClick={toggleContributions} className="flex justify-center border py-1 rounded-lg text-xs cursor-pointer text-yellow-500/40 bg-white/5 hover:bg-white/10 duration-300">
        Show detailed contributions
      </div>}
      <ul>
      {showContributions && (
        <ul className={`transition-transform flex flex-col space-y-1 duration-200 ${showContributions ? 'max-h-screen scale-y-100' : 'max-h-0 scale-y-0'}`}>
          {experience.contributions && experience.contributions.map((contribution, index) => (
            <li className="text-xs border bg-slate-200/5 px-1 rounded py-1 font-light text-gray-300/50" key={index}>{contribution}</li>
          ))}
        </ul>
      )}
      </ul>
    </div>
  )
}