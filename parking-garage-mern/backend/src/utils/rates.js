export function cleanRateCard(rows=[]){
  const out=[];
  for(const row of rows){
    const type=String(row.spotType??row.type??'').trim().toLowerCase();
    if(!['compact','standard','ev'].includes(type)) continue;
    const firstHour=Number(row.firstHour??row.first_hour??row.initialRate);
    const extraHour=Number(row.extraHour??row.extra_hour??row.additionalRate);
    const dailyCap=Number(row.dailyCap??row.daily_cap??row.cap);
    if([firstHour,extraHour,dailyCap].some(n=>!Number.isFinite(n)||n<0)) continue;
    out.push({spotType:type,firstHour,extraHour,dailyCap});
  }
  return out;
}
