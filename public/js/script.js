const socket = io()

if (navigator.geolocation) {
     navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords
            socket.emit("send-location", { latitude, longitude })
        },
        (error) => {
            console.error(error)
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    )
}
else{
    alert('Geolocation is not supported by this browser.')
}



const map = L.map("map").setView([21.76, 78.87], 5)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "Vyankatesh Kamod"
}).addTo(map)

const markers = {}

socket.on("receive-location", (data) => {

    const { id, latitude, longitude } = data;
    map.flyTo([latitude, longitude],16);

    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }
    else{
        markers[id] = L.marker([latitude,longitude]).addTo(map) ;
    }
})

socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id])
        delete markers[id]
    }
})



