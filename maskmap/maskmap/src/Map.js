import React, { Component } from 'react'
import './Map.css'
import './marker (1).png'
import './marker (2).png'
import './marker (3).png'
import './marker (4).png'
import './marker (5).png'

import $ from 'jquery';

const naver = window.naver;

class Map extends Component {
    componentDidMount() {
        var map;
        var usermarker;
        var locationBtnHtml = '<a href="#" class="btn_mylct"><span class="spr_trff spr_ico_mylct">내위치</span></a>';
        var sellerMarkerList = new Array;
        var sellerWindowList = new Array;
        var stores = [];
        var circle;

                function makemap(pos) {
                    var mapOptions = {
                        center: new naver.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                        useStyleMap: true,
        
                        zoom: 15,
                        minZoom: 10, //지도의 최소 줌 레벨
                        // zoomControl: true, //줌 컨트롤의 표시 여부
                        // zoomControlOptions: { //줌 컨트롤의 옵션
                        //     position: naver.maps.Position.TOP_RIGHT,
        
                        // },
                        mapTypeControl: true,
                        mapTypeControlOptions: {
                            style: naver.maps.MapTypeControlStyle.BUTTON,
                            position: naver.maps.Position.RIGHT
                        }
        
                    };
                    searchCoordinateToAddress(mapOptions.center);
        
                    map = new naver.maps.Map('map', mapOptions);
                    naver.maps.Event.once(map, 'init_stylemap', function () {
                        var customControl = new naver.maps.CustomControl(locationBtnHtml, {
                            position: naver.maps.Position.BOTTOM_LEFT
                        });
        
                        customControl.setMap(map);
        
                        var domEventListener = naver.maps.Event.addDOMListener(customControl.getElement(), 'click', function () {
                            map.setCenter(mapOptions.center);
                            usermarker.setPosition(map.getCenter());
                            circle.setCenter(map.getCenter());
                            searchCoordinateToAddress(map.getCenter());
                            recieveMaskSeller(map.getCenter()._lat, map.getCenter()._lng)
                        });
        
        
                        naver.maps.Event.addListener(map, 'dragend', function () {
                            usermarker.setPosition(map.getCenter());
                            circle.setCenter(map.getCenter());
                            searchCoordinateToAddress(map.getCenter());
                            recieveMaskSeller(map.getCenter()._lat, map.getCenter()._lng)
                        });
                        naver.maps.Event.addListener(map, 'zoom_changed', function () {
                            usermarker.setPosition(map.getCenter());
                            circle.setCenter(map.getCenter());
                            searchCoordinateToAddress(map.getCenter());
                            recieveMaskSeller(map.getCenter()._lat, map.getCenter()._lng)
                        });
        
                        recieveMaskSeller(pos.coords.latitude, pos.coords.longitude)
                        circle = new naver.maps.Circle({
                            map: map,
                            center: mapOptions.center,
                            radius: 500,
                            fillColor: 'yellowgreen',
                            fillOpacity: 0.3
                        });
        
                        usermarker = new naver.maps.Marker({
                            position: mapOptions.center,
                            map: map
                        });
                    });
        
        
        
        
                $('#address').on('keydown', function (e) {
                        var keyCode = e.which;
        
                        if (keyCode === 13) { // Enter Key
                            searchAddressToCoordinate($('#address').val());
                        }
                    });
        
                    $('#submit').on('click', function (e) {
                        e.preventDefault();
        
                        searchAddressToCoordinate($('#address').val());
                    });
                }
        
                function recieveMaskSeller(lat, lng) {
                    $.ajax({
                        url: 'https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json',
                        data: { 'lat': lat, 'lng': lng, 'm': '500' },
                        dataType: 'json',
                        success: (d) => { drawMaskMarker(d) },
                        error: (e) => { console.log(e) }
                    })
        
                }
        
                function drawMaskMarker(data) {
                    for (let i = 0; i < sellerMarkerList.length; i++) {
                        sellerMarkerList[i].setMap(null);
                    }
                    for (let i = 0; i < sellerWindowList.length; i++) {
                        sellerWindowList[i].setMap(null);
                    }
        
                    stores = data.stores.sort((a, b) => { return a.name < b.name ? -1 : a.name == b.name ? 0 : 1 })// sort by store name
                    let plentylist = [];
                    let somelist = [];
                    let fewlist = [];
        
                    $('#result').html('');
                    for (let i = 0; i < stores.length; i++) {
                        let remainStatus = stores[i].remain_stat;
                        let status = '<strong style="color:grey">정보없음</strong>';
                        let markerimg = './marker (5).png';
                        let storeexam = '<div class="resultstore"><strong>' + stores[i].name + '</strong><br>'
                            + stores[i].addr + '<br> 재고 : status </div>';
        
                        switch (remainStatus) {
                            case 'plenty':
                                status = '<strong style="color:blue">100개 이상</strong>'
                                markerimg = './marker (1).png';
                                plentylist.push(storeexam.replace('status', status))
                                break;
                            case 'some':
                                status = '<strong style="color:green">30~99개</strong>'
                                markerimg = './marker (2).png';
                                somelist.push(storeexam.replace('status', status))
        
                                break;
                            case 'few':
                                status = '<strong style="color:orange">1~29개</strong>'
                                markerimg = './marker (3).png';
                                fewlist.push(storeexam.replace('status', status))
        
                                break;
                            case 'empty':
                                status = '<strong style="color:red">매진</strong>'
                                markerimg = './marker (4).png';
                                break;
                            case 'break':
                                status = '<strong style="color:darkgrey">판매중지</strong>'
                                break;
                        }
        
        
                        let marker = new naver.maps.Marker({
                            position: new naver.maps.LatLng(stores[i].lat, stores[i].lng),
                            map: map,
                            icon: {
                                url: markerimg,
                                size: new naver.maps.Size(28, 40),
                                origin: new naver.maps.Point(0, 0),
                                anchor: new naver.maps.Point(14, 40)
                            }
                        });
                        sellerMarkerList.push(marker)
        
                        let stocktime;
                        if (stores[i].stock_at == null) {
                            stocktime = '정보없음'
                        }
                        else {
                            stocktime = stores[i].stock_at.split(' ')[1].split(':')
                            stocktime = stocktime[0] + '시 ' + stocktime[1] + '분'
                        }
        
                        let contentString = [
                            '<div class="iw_inner">',
                            '   <h3>' + stores[i].name + '</h3>',
                            '   <p class="store_addr">' + stores[i].addr + '</p>',
                            '<p>재고 : ' + status + '</p>',
                            '<p>입고 예상 시간 : ' + stocktime + '</p>',
                            '</div>'
                        ].join('');
        
        
                        let infowindow = new naver.maps.InfoWindow({
                            content: contentString
                        });
                        sellerWindowList.push(infowindow)
                        naver.maps.Event.addListener(marker, "click", function (e) {
                            if (infowindow.getMap()) {
                                infowindow.close();
                            } else {
                                infowindow.open(map, marker);
                            }
                        });
                        naver.maps.Event.addListener(marker, "mouseover", function (e) {
                            if (infowindow.getMap()) {
                                infowindow.close();
                            } else {
                                infowindow.open(map, marker);
                            }
                        });
                        naver.maps.Event.addListener(marker, "mouseout", function (e) {
                            if (infowindow.getMap()) {
                                infowindow.close();
                            }
                        });
                    }
        
                    if (plentylist.length == 0 && somelist.length == 0 && fewlist.length == 0) {
                        $('#result').append('구입 가능한 약국 없음');
                    } else {
                        while (plentylist.length > 0) {
                            $('#result').append(plentylist.pop());
                        }
                        while (somelist.length > 0) {
                            $('#result').append(somelist.pop());
                        }
                        while (fewlist.length > 0) {
                            $('#result').append(fewlist.pop());
                        }
                    }
                }
        
                function searchAddressToCoordinate(address) {
                    naver.maps.Service.geocode({
                        query: address
                    }, function (status, response) {
                        if (status === naver.maps.Service.Status.ERROR) {
                            if (!address) {
                                return alert('Geocode Error, Please check address');
                            }
                            return alert('Geocode Error, address:' + address);
                        }
        
                        if (response.v2.meta.totalCount === 0) {
                            return alert('No result.');
                        }
        
                        var htmlAddresses = [],
                            item = response.v2.addresses[0],
                            point = new naver.maps.Point(item.x, item.y);
        
                        if (item.roadAddress) {
                            htmlAddresses.push('[도로명 주소] ' + item.roadAddress);
                        }
        
                        if (item.jibunAddress) {
                            htmlAddresses.push('[지번 주소] ' + item.jibunAddress);
                        }
        
                        if (item.englishAddress) {
                            htmlAddresses.push('[영문명 주소] ' + item.englishAddress);
                        }
                        $('#result').html(htmlAddresses.join('<br>'));
                        map.setCenter(point);
                        usermarker.setPosition(map.getCenter());
                        circle.setCenter(map.getCenter());
                        recieveMaskSeller(map.getCenter()._lat, map.getCenter()._lng)
        
                    });
                }
        
                function searchCoordinateToAddress(latlng) {
                    naver.maps.Service.reverseGeocode({
                        coords: latlng,
                        orders: [
                            naver.maps.Service.OrderType.ADDR,
                            naver.maps.Service.OrderType.ROAD_ADDR
                        ].join(',')
                    }, function (status, response) {
                        if (status === naver.maps.Service.Status.ERROR) {
                            if (!latlng) {
                                return alert('ReverseGeocode Error, Please check latlng');
                            }
                            if (latlng.toString) {
                                return alert('ReverseGeocode Error, latlng:' + latlng.toString());
                            }
                            if (latlng.x && latlng.y) {
                                return alert('ReverseGeocode Error, x:' + latlng.x + ', y:' + latlng.y);
                            }
                            return alert('ReverseGeocode Error, Please check latlng');
                        }
        
                        var items = response.v2.results,
                            address = '',
                            htmlAddresses = [];
        
                        for (var i = 0, ii = items.length, item, addrType; i < ii; i++) {
                            item = items[i];
                            address = item.region.area1.name + ' ' + item.region.area2.name + ' ' + item.region.area3.name || '';
                            $('.search #address').val(address)
                            break;
                        }
        
                    });
                }
                makemap(this.props.position)
        
            }
            


    render() {
        return (<div className="map" id="map"></div>)
    };
}

export default Map