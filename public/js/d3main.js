d3.json('/geojson/tokyo.geojson', function(err, collection) {
  d3main(collection);
});

function d3main(collection) {
  var width = 1150,
      height = 600,
      centered;
  var scale = 60000;
  var scaleextent = 1;
  // var center = [139.7531, 35.6859];
  var center = d3.geo.centroid(collection);
  
  var svg = d3.select("#map").append("svg")
            .attr({
              "width":width,
              "height":height,
              "overflow":"hidden",
              "position":"relative",
              "vertical-align":"middle",
              "pointer-events":"all",
            })
            ;

  var rect = svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr({
              "fill":"#1B2C73",
              "fill-opacity":"1",
            })

  var g = svg.append("g");

  var projection = d3.geo.mercator()
                     .center(center)
                     .scale(scale)
                     .translate([width / 2, height / 2]);
  
  var path = d3.geo.path().projection(projection);
  
  var zoom = d3.behavior.zoom()
               .scaleExtent([1, 20])
               .on("zoom", zoomed);
 
  createMapBase();
  
  svg
    .call(zoom)
    .call(zoom.event);

  function zoomed() {
    g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    g.attr('d', path);
  }
  
  function createMapBase(){
    menu();
    information();
    d3land();
    render();
  }

  function information(){
    var priceinfo = svg.append("g").attr("class", "priceinfo")
      .selectAll("text")
      .data(price_colors)
      .enter().append("text")
      .attr("font-weight", "bold")
      .attr("x", 150)
      .attr("y", function(d, i){ 
        return 30 + 15 * i;
      })
      .style("fill",　function(d){ 
        return getpricecolor(d);
      })
      .style("text-anchor",　"end")
      .text(function(d){
        return getpricetext(d) + "/m2以上";
      })
      ;
  }

  function d3land(){
      var land = g.append("g").attr("class", "land")
        .selectAll("path")
        .data(collection.features)
        .enter().append('path')
        .attr("land_idx", function(d, i) {
          return i + 1;
        })
        .attr("d", path)
        .attr({
          "fill":"#000",
          "fill-opacity":"1",
        })
        ;
  }

  function render() {
    var year = location.pathname.replace(/^\//g, "");
    $('#year').text(year + "年度");

    $('.landprice').empty();
    $('td span').text('');
    $('#address').html('&nbsp;')

    var obj = new Array();
    d3.json('/geojson/' + 'tokyo-landprice-' + year + '.geojson', function(err, collection) {
      if (err) {
          $('#map').text('ファイルを読み込めませんでした。');
          return;
      }
      g.append("g").attr("class", "landprice")
        .selectAll('path')
        .data(collection.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('centroid', function(d) {return path.centroid(d);})
        .attr("id", function(d, i) {
          var tmp = new Object();
          tmp["address"] = d.properties.address;
          tmp["price"] = Number(d.properties.price);
          tmp["id"] = "landprice" + String(i + 1);
          obj.push(tmp)
          return tmp["id"];
        })
        .style('fill', function(d) {
          return getpricecolor(d.properties.price);
        })
        .on('click', function(d) {
          clicked(d);
          detailed(d);
          focused(d);
        })
        sidebar(obj);
    });
  }

  function clicked(d) {
    var x, y, k;
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = zoom.scale();

    g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
  }

  function detailed(d) {
    // d3.select('#city_code')
    //   .text(d.properties.city_code);
    // d3.select('#city_name')
    //   .text(d.properties.city_name);
    d3.select('#price')
      .text(getpricetext(d.properties.price))
      .style("background-color",　getpricecolor(d.properties.price))
      .style("font-weight", "bold")
      ;
    d3.select('#station')
      .text(getstationtext(d.properties.station, d.properties.distance_from_station))
      ;
    d3.select('#address')
            .text((d.properties.address).replace(/\s+/g, ""));
  }

  function focused(d) {
    i = 0;
    var m = path.centroid(d);
    g.append("circle")
      .attr("cx", m[0])
      .attr("cy", m[1])
      .attr("r", 1e-6)
      .attr({
        "fill":"none",
        "stroke":getpricecolor(d.properties.price),
        "stroke-opacity":"1",
        "stroke-width":"10",
      })
      .transition()
        .duration(1000)
        .delay(100)
        .ease(Math.sqrt)
        .attr("r", 30)
        .style("stroke-opacity", 1e-6)
        .style("stroke-width", 1e-6)
        .remove();
    // d3.event.preventDefault();
  }

  function menu() {
    var menu = d3.select("#menu");
    for (i = 0 ; i < years.length ; i++ ) {
      menu.append("li")
        .append("a")
        .attr("href", "/" + years[i])
        .text(years[i])
        ;
    }
  }

  function sidebar(obj) {
    $('#sidebar').empty();

    obj.sort(
      function(a,b){
        return (a.price > b.price) ? -1 : 1;
      }
    );

    var sidebar = d3.select("#sidebar")
      .style("background-color", "#1B2C73")
      .style("color",　"white")
      .style("font-weight", "bold")
      ;

    for(i = 0 ; i < obj.length ; i++ ){
      sidebar.append("li")
             .append("span")
             ;

      sidebar.append("span")
        .attr("class", "badge badge-important")
          .style("background-color",　getpricecolor(obj[i]["price"]))
          .style("font-size", "small")
          .text(getpricetext(obj[i]["price"]))
          ;
      
      sidebar.append("span")
        .append("a")
        .attr("href", "#")
        .style("text-decoration", "underline")
        .style("font-size", "x-small")
        .style("color",　"white")
        .text(obj[i]["address"].replace(/\s+/g, ""))
        .attr("onClick", function() {
          return 'selected("' + obj[i]["id"] + '"); return false;';
        })
        .attr("onMouseover", function() {
          return 'selected("' + obj[i]["id"] + '"); return false;';
        })
        ;
    }
  }
}

function selected(id) {
  var address = d3.select('#' + id);
  address.on("click")(address[0][0].__data__);
}
