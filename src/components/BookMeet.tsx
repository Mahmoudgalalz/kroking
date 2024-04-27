import { getCalApi } from "@calcom/embed-react";
import { CalendarPlus } from "lucide-react";
import { useEffect } from "react";
export default function BookMeet() {
useEffect(()=>{
  (async function () {
  const cal = await getCalApi();
  cal("ui", {"styles":{"branding":{"brandColor":"#000000"}},"hideEventTypeDetails":false,"layout":"month_view"});
  })();
}, [])
return <button className="border-2 p-2 rounded-lg hover:bg-white/15 duration-200" data-cal-namespace=""
  data-cal-link="mahmoudgalal/quick-chat"
  
  data-cal-config='{"layout":"month_view"}'
  ><CalendarPlus size={16}/></button>;
};