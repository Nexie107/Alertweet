//actually the same as EssoneSO
function dates_TCL(tweet){ //retrieve every date formatted as DD/MM or MM/DD similar
  dates=tweet.match(/(\d){1,2}\/(\d){1,2}/g)
  now=new Date()
  if (Array.isArray(dates)){
    startTime=new Date(now.getFullYear(),dates[0].split('/')[1]-1,dates[0].split('/')[0]) //for dates formatted DD/MM in the tweet. The start date will always be considered to be the first in the tweet
    if (dates.length>=2){endTime=new Date(now.getFullYear(),dates[1].split('/')[1]-1,dates[1].split('/')[0]) //the end date will always be considered to be the second date from the tweet 
    }else{endTime=new Date(startTime)}
    if (endTime.getMonth()<startTime.getMonth()){//in case of year change. ASSUMED THAT NO DISRUPTANCE LASTS MORE THAN 1 YEAR 
    endTime.setFullYear(now.getFullYear()+1) 
    }
    return ([startTime,endTime])
  }
  return[now,new Date(now)]
}

function time_TCL(tweet){ //retrieve every time formatted as [HH]h[mm] or [HH]:[mm] or similar to these two
  tweet_time=tweet.match(/(\d){1,2}(h|:)(\d){0,2}/g)
  if (Array.isArray(tweet_time)){
    for (t in tweet_time){
      tweet_time[t]=new Date(0,0,1,tweet_time[t].split(/(h|:)/g)[0],tweet_time[t].split(/(h|:)/g)[2])
    }
    return tweet_time
  }
  now=new Date()
  return new Date(0,0,1,now.getHours(),now.getMinutes())
}
