var years = [
             "1983",
             "1984",
             "1985",
             "1986",
             "1987",
             "1988",
             "1989",
             "1990",
             "1991",
             "1992",
             "1993",
             "1994",
             "1995",
             "1996",
             "1997",
             "1998",
             "1999",
             "2000",
             "2001",
             "2002",
             "2003",
             "2004",
             "2005",
             "2006",
             "2007",
             "2008",
             "2009",
             "2010",
             "2011",
             "2012",
             "2013",
             "2014",
            ];

var price_colors = [
                    "2000000",
                    "1500000",
                    "1000000",
                    "800000",
                    "600000",
                    "400000",
                    "350000",
                    "300000",
                    "250000",
                    "200000",
                    "100000",
                    "75000",
                    "50000",
                    "25000",
                    "0"
                   ];

function getpricecolor(price){
  var color;
  if (price >= 2000000) {
    color = "hsla(0,100%,50%,0.8)";
  } else if (price >= 1500000) {
    color = "hsla(0,75%,50%,0.8)";
  } else if (price >= 1000000) {
    color = "hsla(0,50%,50%,0.8)";
  } else if (price >= 800000) {
    color = "hsla(20,50%,50%,0.8)";
  } else if (price >= 600000) {
    color = "hsla(40,50%,50%,0.8)";
  } else if (price >= 400000) {
    color = "hsla(60,50%,50%,0.8)";
  } else if (price >= 350000) {
    color = "hsla(80,50%,50%,0.8)";
  } else if (price >= 300000) {
    color = "hsla(100,50%,50%,0.8)";
  } else if (price >= 250000) {
    color = "hsla(120,50%,50%,0.8)";
  } else if (price >= 200000) {
    color = "hsla(140,50%,50%,0.8)";
  } else if (price >= 100000) {
    color = "hsla(160,50%,50%,0.8)";
  } else if (price >= 75000) {
    color = "hsla(180,50%,50%,0.8)";
  } else if (price >= 50000) {
    color = "hsla(200,50%,50%,0.8)";
  } else if (price >= 25000) {
    color = "hsla(220,50%,50%,0.8)";
  } else {
    color = "hsla(240,50%,50%,0.8)";
  }
  return color;
}

function getpricetext(price){
  return Number(price).toLocaleString("ja-JP") + "円";
}

function getstationtext(station, distance_from_station){
  if(station != null){
    return station + "駅から" + distance_from_station + "m";
  } else{
    return "";
  }
}