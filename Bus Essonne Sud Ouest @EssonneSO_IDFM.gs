//actually the same as TCL
function time_EssonneSO(tweet){
  times=tweet.match(/(\d){1,2}h(\d){0,2}/g) //retrieve every time formatted as [HH]h[mm] or similar 
  if (Array.isArray(times)){
    for (t in times){
      times[t]=new Date(0,0,1,times[t].split('h')[0],times[t].split('h')[1])
    }
    return times
  }
  now=new Date()
  return new Date(0,0,1,now.getHours(),now.getMinutes())
}


function date_EssonneSO(tweet){
  dates=tweet.match(/(\d){1,2}\/(\d){1,2}/g) //retrieve every date formatted as DD/MM or MM/DD similar 
  now=new Date()
  if (Array.isArray(dates)){
    startTime=new Date(now.getFullYear(),dates[0].split('/')[1]-1,dates[0].split('/')[0]) //for dates formatted DD/MM in the tweet
    if (dates.length>=2){endTime=new Date(now.getFullYear(),dates[1].split('/')[1]-1,dates[1].split('/')[0])
    }else{endTime=startTime()}
    if (endTime.getMonth()<startTime.getMonth()){
    endTime.setFullYear(now.getFullYear()+1) //in case of year change. ASSUMED THAT NO DISRUPTANCE LASTS MORE THAN 1 YEAR 
    }
    return ([startTime,endTime])
  }
  return[now,now]
}