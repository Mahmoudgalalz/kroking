import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  fullName: z.string().nonempty(),
  email: z.string().email(),
  message: z.string().min(10),
});

export default function Hire() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: any) => {
    const req = await fetch('https://api.hi.new/email/kroking', {
      method: "POST",
      body: JSON.stringify({
        subject:data.fullName,
        from:data.email,
        message: data.message
      })
    })
    const res = await req.json()
    console.log(req);
    // Handle form submission logic here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-500/5 border rounded-lg relative w-full border-yellow-500/20 px-2 py-2 space-y-2">
      <div className="flex justify-between text-gray-200/40 text-xs">
        <div>Interested in hiring me</div>
        <div>Full-time, Contract</div>
      </div>
      <div className="flex flex-col space-y-1 h-fit">
        <div className="flex space-x-4">
        <input type="text" {...register("fullName")} placeholder="Subject" className="text-gray-200/40 placeholder:text-gray-200/40 bg-white/5 rounded-lg text-xs py-1 px-1.5" />
        
        <input type="email" {...register("email")} placeholder="Email" className="text-gray-200/40 placeholder:text-gray-200/40 bg-white/5 rounded-lg text-xs py-1 px-1.5" />
        </div>
        {errors.fullName && <span className="text-red-500/20 text-xs">Full Name is required</span>}
        {errors.email && <span className="text-red-500/20 text-xs">Email is required and must be valid</span>}
      </div>
      <div>
      </div>
      <div>
        <textarea {...register("message")} placeholder="Your Message" className="text-gray-200/40 w-full h-20 placeholder:text-gray-200/40 bg-white/5 rounded-lg text-xs py-1 px-1.5" />
        {errors.message && <span className="text-red-500">Message must be at least 10 characters long</span>}
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-xs"><span className="text-[10px] text-gray-400/20">powered by </span><a target="_blank" className="text-gray-400/80" href="https://hi.new">hi.new</a></h1>
      <button type="submit" className="bg-gray-500/20 text-xs font-light hover:bg-gray-700/20 duration-200 text-white py-1 px-2 flex-end rounded">Submit</button>
      </div>
    </form>
  )
}
