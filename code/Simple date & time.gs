function simple_date(){
  now=new Date()
  date=new Date(now.getFullYear(),now.getMonth(),now.getDate())
  return([date,date]) //just return the current date in a format that matches the main code requirements
}

function simple_time(){
  now=new Date()
  return new Date(0,0,1,now.getHours(),now.getMinutes()) //just return the current date in a format that matches the main code requirements
}