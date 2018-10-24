var global_loc=0;
var num_locations=10;


// register the grid component
Vue.component('demo-grid', {
  delimiters: ['<%', '%>'],
  template: '#grid-template',
  props: {
    data: Array,
    columns: Array,
    filterKey: String
  },
  data: function () {
    var sortOrders = {}
    this.columns.forEach(function (key) {
      sortOrders[key] = 1
    })
    return {
      sortKey: '',
      sortOrders: sortOrders
    }
  },
  computed: {
    filteredData: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var data = this.data
      if (filterKey) {
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    }
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    }
  }
})

//grid object
var grid_control = new Vue({
      el: '#demo',
      delimiters: ['<%', '%>'],
      data: {
        searchQuery: '',
        gridColumns: [],
        gridData: []
      }
    });
//change grid data for load function
function n_locations_grid(data,grid_control)
{
    grid_control.gridColumns=["IP","REASON","country_name"];
    grid_control.gridData=data
}

//data transform for load function
function grid_data_extract(data)
{
    result=[]
    for(key in obj)
    {
        var loc={IP:obj[key]['IP'],
            REASON:obj[key]['REASON'],
            country_name:obj[key]['country_name']
        }
        result.push(loc)
        
    }
    return result
}


//data transform for search function
function search_grid_data_extract(data)
{
    result=[]
    for(key in obj)
    {
        var loc={IP:obj[key]['IP'],
            REASON:obj[key]['REASON'],
            country_name:obj[key]['detail']['country_name'],
            city:obj[key]['detail']['city'],
            region:obj[key]['detail']['region'],
            organization:obj[key]['detail']['org']
        }
        result.push(loc)
        
    }
    return result
}


//change grid data for search function
function search_grid(data,grid_control)
{
    grid_control.gridColumns=["IP","REASON","country_name","city","region","organization"];
    grid_control.gridData=data
    
}



function ip_address_validation(ip)
{
    ValidIP = false; 
    ipParts = ip.split(".");
    if(ipParts.length==4){
      for(i=0;i<4;i++){
         
        TheNum = parseInt(ipParts[i]);
        if(TheNum >= 0 && TheNum <= 255){}
        else
        {return false;}
         
      }
      return true;
       
    }
    return false;
}

//see if we find the input IP address
function check_for_return(data)
{
    if(data.length==0)
    {
        return false
    }
    return true
}
/*
function creat_result_list(id_number,geo_locations)
{
    var $newdiv1 = $( "<div id='result'>good</div>" )
    $( "body" ).append($newdiv1)
    var result = new Vue
        ({
            el: id_number,
            delimiters: ['[[', ']]'],
            data: {
                message: 'Hello Vue!'
            },
            methods:
            {
                go_to: function (event) 
                {
                    var map = new google.maps.Map(document.getElementById('map'), {
                		zoom: 10,
                		center: new google.maps.LatLng(38.64,-90),
                		mapTypeId: google.maps.MapTypeId.ROADMAP
                	});
                
                	var infowindow = new google.maps.InfoWindow({});
                }
            }
        });
}

*/

var search = new Vue
({
    el: '#search',
    delimiters: ['[[', ']]'],
    data: {
        IP_addr: []
    },
    methods:
    {
        search_IP: function (event) 
        {
            IP_addr=$("#IP_addr").val();
            if(!ip_address_validation(IP_addr))
            {
                alert("Invalid IP Address!");
                return -1
            }
            $.post( "/search/"+IP_addr, function( data ) {
                obj=JSON.parse(data)
                if(!check_for_return(obj))
                {
                    alert("IP Not Found!");
                    return -1;
                }
                
                var grid_data=search_grid_data_extract(obj)
                search_grid(grid_data,grid_control);
                
                var map = new google.maps.Map(document.getElementById('map'), {
            		zoom: 13,
            		center: new google.maps.LatLng(obj[0]['detail']['latitude'], obj[0]['detail']['longitude']),
            		mapTypeId: google.maps.MapTypeId.ROADMAP
            	});
            	
            	var infowindow = new google.maps.InfoWindow({});
                marker = new google.maps.Marker({
            			position: new google.maps.LatLng(obj[0]['detail']['latitude'], obj[0]['detail']['longitude']),
            			map: map
            			
            	});
            	google.maps.event.addListener(marker, 'click', (function (marker) {
            			return function () {
            				infowindow.setContent(obj[0]['IP']);
            				infowindow.open(map, marker);
            			}
            	})(marker));
              
            });
            
            
        	
        }
    }
});


var load_n_locations = new Vue
({
    el: '#load_n_locations',
    delimiters: ['[[', ']]'],
    data: {
        
    },
    methods:
    {
        load_n_locations: function (event) 
        {
            $.post( "/load_n_locations/"+num_locations, function( data ) {
                obj=JSON.parse(data)
                
                var grid_data=grid_data_extract(obj);
                n_locations_grid(grid_data,grid_control);
                
                var locations=[]
                for(key in obj)
                {
                    var loc=[obj[key]['IP'],
                        obj[key]['latitude'],
                        obj[key]['longitude']
                    ]
                    locations.push(loc)
                    
                }
                
                //alert(locations[0][1]);
                
                var map = new google.maps.Map(document.getElementById('map'), {
            		zoom: 3,
            		center: new google.maps.LatLng(locations[0][1], locations[0][2]),
            		mapTypeId: google.maps.MapTypeId.ROADMAP
            	});
            	
            	google.maps.event.addListener(map,'zoom_changed', function()
	            {
                    if (map.getZoom() < 3)
                    {
                        map.setZoom(3);
	                }
                });
  
            	
            	var infowindow = new google.maps.InfoWindow({});
            	
                
            	var marker, i;

            	for (i = 0; i < locations.length; i++) {
            		marker = new google.maps.Marker({
            			position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            			map: map
            			
            		});
                    //alert(locations[i][1]);
            		google.maps.event.addListener(marker, 'click', (function (marker, i) {
            			return function () {
            				infowindow.setContent(locations[i][0]);
            				infowindow.open(map, marker);
            			}
            		})(marker, i));
            	}

                            
            });
        }
    }
});






