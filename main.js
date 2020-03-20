var time = new Date();
const year = time.getUTCFullYear();
const date = time.getUTCDate() ;
const months = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
  };
const monthIndex = time.getUTCMonth();
const monthName = months[monthIndex];
const days = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
];
const dayName = days[time.getUTCDay()];
const formattedDate = `${dayName}, ${date} ${monthName} ${year}`;

function initMap() {
    var cords;
    cords ={lat: -25.363, lng: 131.044};
    var people;
    var astronavts;

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: cords
    });

    var marker = new google.maps.Marker({
        position: cords,
        map: map,
        title: ''
    });

    $('<span>', {class: 'Location', text: "longitude:" + cords.lng + "," + "latitude:" + cords.lat}).appendTo('.locate-header');
    $('<span>', {
        class: 'Time',
        text: 'Curent UTC TIME: ' + time.getUTCHours() + " : " + (time.getUTCMinutes()<10 ? ('0'+time.getUTCMinutes()) : (''+time.getUTCMinutes()))
    }).appendTo('.time-box');
    $('<span>', {class: 'TimeDate',text: formattedDate}).appendTo('.time-box');

    setInterval(function () {
        $.ajax({
            type: 'GET',
            url: "http://api.open-notify.org/iss-now.json",
            beforeSend: function (xhr) {
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
            }
        })
            .done(function (data) {
                    var location;
                    location = JSON.parse(data);
                    cords.lat = parseFloat(location.iss_position.latitude);
                    cords.lng = parseFloat(location.iss_position.longitude);
                    marker.setPosition(cords);
                    map.panTo(cords, animate=true);
            })
        $('.Location').html("longitude:" + cords.lng + "," + "latitude:" + cords.lat);
        time = new Date();
        $('.Time').html('Curent UTC TIME: ' + time.getUTCHours() + " : " +  (time.getUTCMinutes()<10 ? ('0'+time.getUTCMinutes()) : (''+time.getUTCMinutes())));
        $('.TimeDate').html(formattedDate);
        $.ajax({
            type: "GET",
            url: "http://api.open-notify.org/astros.json",
            beforeSend: function (xhr) {
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
            }
        })
            .done(function(data) {
                people = JSON.parse(data);
                astronavts = people.people;
                $('.astronavts people').html(astronavts);
            })
    }, 5000);

        $.ajax({
            type: "GET",
            url: "http://api.open-notify.org/astros.json",
            beforeSend: function (xhr) {
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
            }
        })
            .done(function (data) {
                people = JSON.parse(data);
                astronavts = people.people; 
                    for (var i = 0; i < astronavts.length; i++) { astronavts[i]['craft'] == "ISS" ?
                        $('<div>', {class: 'astronavts people' + i, text: astronavts[i]['name']}).appendTo('.astronavts-box')
                        : undefined;
                    }
                $('<img>', {src: 'people.png', width: '20', height: '20'}).appendTo('.astronavts');
                $('<span>', {
                    class: 'TotalAmount',
                    text: 'Total amount:' + " " + astronavts.length + " people on ISS"
                }).appendTo('.astronavts-box');
            });
        
};