export function calculateFee(start,end,config){
  const minutes=Math.max(1,Math.ceil((new Date(end)-new Date(start))/60000));
  const hours=Math.ceil(minutes/60);
  return Math.min(config.dailyCap,config.firstHour+Math.max(0,hours-1)*config.extraHour);
}
