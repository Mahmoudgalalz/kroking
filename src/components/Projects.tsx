import { useState } from "react";

export type ProjectsProps = {
  company?:string,
  name:string,
  description: string,
  highlighted?: boolean,
  link:string,
  github?: string,
  favicon?: string,
  insights?: Record<string, string>
} 

export type TinyProjectsProps = {
  name:string,
  
  github?: string,
} 

export function ProjectCard({project}:{project:ProjectsProps}){
  return (
    <>
    { project.highlighted &&
      <div className="bg-slate-500/10 rounded-lg relative w-full border-yellow-500/20 px-2 py-2 space-y-2">
      <div className="flex justify-between items-center">
          <h1>{project.name} {project.company &&  <><span className="text-gray-200/40">at </span>{project.company}</> }</h1>
          {project.favicon && <img className="h-10 w-10 opacity-60" src={project.favicon} alt={`${project.name}-icon`} />}
        </div><div>
            <p className="text-xs text-gray-200/60 leading-5">{project.description}</p>
          </div>
          {project.insights &&
          <div className="flex justify-center space-x-2">
            {
            Object.entries(project.insights).map(([key,value])=>{
              return (
                <div className="flex flex-col rounded bg-gray-700/20 py-1 items-center justify-center text-white/60 px-2 ">
                <h1 className="text-xs">{key}</h1>
                <h1>{value}</h1>
                </div>
              )
            })}
            </div>
            }
          <div className="text-xs flex justify-end font-light ">
            { project.link && <a className="flex hover:text-yellow-500/40 duration-200 items-center gap-0.5" target="_blank" href={project.link}><span>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M18.364 15.536L16.95 14.12l1.414-1.414a5 5 0 0 0-7.071-7.071L9.878 7.05L8.464 5.636l1.414-1.414a7 7 0 0 1 9.9 9.9zm-2.829 2.828l-1.414 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 0 0 7.07 7.071l1.415-1.414zm-.707-10.607l1.415 1.415l-7.072 7.07l-1.414-1.414z"/></svg></span> Link</a> }
            { project.github && <a target="_blank" className="flex hover:text-yellow-500/40 duration-200 items-center gap-0.5" href={project.github}><span><svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M9.35 16.88c0 .07-.07.12-.17.12S9 17 9 16.88s.08-.12.17-.12s.18.05.18.12m-1-.15c0 .07 0 .15.14.17a.15.15 0 0 0 .2-.07c0-.07 0-.14-.14-.17s-.18 0-.2.07m1.42-.05c-.09 0-.15.08-.14.16s.09.11.19.09s.15-.09.14-.16s-.09-.1-.19-.09M11.9 4A7.83 7.83 0 0 0 4 12.07A8.29 8.29 0 0 0 9.47 20c.41.07.56-.19.56-.4v-2s-2.26.5-2.74-1c0 0-.36-1-.89-1.21c0 0-.74-.52.05-.51a1.67 1.67 0 0 1 1.24.85a1.69 1.69 0 0 0 2.36.69a1.83 1.83 0 0 1 .51-1.11c-1.8-.21-3.62-.47-3.62-3.66A2.54 2.54 0 0 1 7.7 9.7a3.21 3.21 0 0 1 .08-2.24c.68-.22 2.23.89 2.23.89a7.46 7.46 0 0 1 4.05 0s1.55-1.11 2.23-.89a3.14 3.14 0 0 1 .08 2.24a2.61 2.61 0 0 1 .83 1.95c0 3.2-1.9 3.45-3.7 3.66a2 2 0 0 1 .5 1.5v2.77a.42.42 0 0 0 .56.4A8.22 8.22 0 0 0 20 12.07A8 8 0 0 0 11.9 4M7.14 15.41v.17a.12.12 0 0 0 .17 0s0-.11 0-.18s-.13-.03-.17.01m-.35-.27s0 .1.07.13a.09.09 0 0 0 .14 0s0-.1-.07-.13s-.12-.03-.14 0m1 1.18v.21c0 .07.17.08.21 0s0-.14 0-.21s-.13-.05-.17 0Zm-.37-.49v.2c0 .08.14.11.19.08a.16.16 0 0 0 0-.21c-.05-.08-.13-.11-.19-.07"/></svg></span>Github</a> }
          </div>
    </div>
  }
  </>
  )
}

export function TinyProjectCard({project}:{project:ProjectsProps}){
  return (
    <>
    { !project.highlighted &&
      <a href={project.github} className="hover:opacity-75 duration-200 bg-slate-500/10 rounded-lg relative w-full border-yellow-500/20 px-2 py-2 space-y-2">
      <div className="flex items-center">
        <div className="mx-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 22 22"><path fill="currentColor" d="M12 16h-2v-6H9v1H8v1H6v-2h1V9h1V8h1V7h1V6h2v1h1v1h1v1h1v1h1v2h-2v-1h-1v-1h-1m6 10H4v-1H3v-1H2V4h1V3h1V2h14v1h1v1h1v14h-1v1h-1m-1-1v-1h1V5h-1V4H5v1H4v12h1v1Z"/></svg>
        </div>
          <h1 className="text-[0.788rem]">{project.name}<span className="mx-1">-</span> </h1>
          <p className="text-xs">{project.description}</p>
        </div>
    </a>
  }
  </>
  )
}