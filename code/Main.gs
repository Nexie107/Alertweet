spreadsheet=SpreadsheetApp.getActive()
settings=spreadsheet.getSheetByName("settings")

function parseSettings(){//parse the settings
  if (settings.getRange("B12").getValue()==false){return false}//switch
  keywords=settings.getRange("B10").getValue().split(",")//keywords
  times=eval(settings.getRange("B2:B8").getValues())//times
  user_days=settings.getRange("D2:D8").getValues().flat()//days of the week
  return [keywords,user_days,times]
}


function fetchLastTweet(){
  settings.getRange("C12").setValue("")
  url="https://twstalker.com/"+settings.getRange("C11").getValue()// for public access to twitter with no login
  xpathText="/html/body/main/div[4]/div/div/div[2]/div[1]/div[1]/div[2]/p" //xpath to last tweet
  settings.getRange("C12").setFormula('=REGEXREPLACE(CHOOSECOLS(IMPORTXML("'+url+'";"'+xpathText+'");1);"\n";"")')
  tweet=settings.getRange("C12").getValue()
  return tweet
}


function includes_kw(tweet){//look for keywords presence in tweet
  for (k in keywords){
    if (tweet.includes(keywords[k])){return true}
  }
  return false
} 


function check_dates(start,end){ //check whether any of the chosen dates from dates_TCL are wanted
  d=start
  while (d<=end){
    if (user_days.includes(d.getDay())){return true}
    d.setDate(d.getDate()+1) //might fail if daylight savings occur during the period
  }
  return false
}


function check_time(tweet_time){  //to check one single time. DO NOT USE DIRECTLY IN RUN
  day=times[(startTime.getDay()-1)+7*(startTime.getDay()==0)][0].split(',')//times for the current day of the week
  for (t in day){
    start=day[t].split('-')[0]
    start=new Date(0,0,1,start.split(":")[0],start.split(":")[1])//start of t-th period of the day in js date format
    end=day[t].split('-')[1]
    end=new Date(0,0,1,end.split(":")[0],end.split(":")[1])//end of t-th period of the day in js date format
    if ((tweet_time>=start) && (tweet_time<=end)){
      if (tweet_time.getHours()*60+tweet_time.getMinutes()<now.getHours()*60+now.getMinutes()){ //in case they tweet after the disurption has happened (this happens lol), so the notification is still sent
        startTime.setHours(now.getHours(),now.getMinutes())
      }else{
        startTime.setHours(tweet_time.getHours(),tweet_time.getMinutes())
      }
      endTime.setHours(end.getHours(),end.getMinutes(),0)//end time is the end of the time monitored time period in which the current time/tweet time (depending on the tweet content) falls in
      return true}
  }
  return false
}


function check_multi_times(tweet_time){ //to check 1+ times. USE THIS ONE IN RUN 
  if (Array.isArray(tweet_time)){
    for (t in tweet_time){
      if (check_time(tweet_time[t])){return true}
    }
    return false
  }
  return check_time(tweet_time)
}

function avoidRedundancy(tweet){  //very important: to not get spammed with the same event until next tweet
  logs=spreadsheet.getSheetByName("logs")
  if (logs.getRange("C2").getValue()==tweet){return false}
  return true
}

function event(){// create the calendar event and send notification
  cal=CalendarApp.getCalendarById(settings.getRange('D12').getValue())
  ev=cal.createEvent(tweet,startTime,endTime)
  ev.addPopupReminder(5) //notification cannot be set to later than 5mins before the event (in the script), but will show anyway 
}

function run(){
  if (parseSettings()){
    [keywords,user_days,times]=parseSettings()
    tweet=fetchLastTweet()
    console.log(tweet)
    if (avoidRedundancy(tweet)){
      if (includes_kw(tweet)){
        [startTime,endTime]=dates_TCL(tweet)//change here for a custom date retrieving function (beware of the output format!)
        if (check_dates(startTime,endTime)){
          tweet_time=time_TCL(tweet)//change here for a custom time retrieving function (beware of the output format!)
          if (check_multi_times(tweet_time)){
            Logger.log(startTime)
            Logger.log(endTime)
            event()
            logs.insertRowBefore(2)
            logs.getRange("A2:C2").setValues([[startTime,endTime,tweet]])
            console.log([startTime,endTime,tweet])
          }
        }
      }
    }
  } 
  return false
}
