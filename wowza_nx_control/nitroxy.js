var server = "rtmp://localhost/live"
var previewStream = "preview";
var liveStream = "nitroxy";

function remoteCall(function_name /* args ...*/) {
	var args = Array.slice(arguments, 1)

	var sjax = new XMLHttpRequest();
	sjax.open("POST", "backend.php", false);
	sjax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	sjax.send("json="+JSON.stringify({'function': function_name, 'args': args}));

	try {
		var ret = JSON.parse(sjax.responseText);
		if(ret.status == "success") {
			return ret.data
		} else {
			console.log("Remote error: " + ret["data"])
			return false;
		}
	} catch (err) {
		console.log("remoteCall error, is the remote command up (and is the application started?) ("+err+")");
		return false;
	}
}

$(function() {
	updateStreamInfo();
	updateStreamList();

	$("#do_change").click(function() {
		switchStream($("#preview_stream").val());
		return false;
	})

	$("#do_change_from_list").click(function() {
		switchStream($("#preview_stream_list").val());
		return false;
	})

	$("#publish").click(function() {
		publish();
		return false;
	})

	$("#refresh_streams").click(function() {
		updateStreamList();
		return false;
	})
})

function updateStreamInfo() {
	$("#live_data").html("Current stream: " + remoteCall("currentLive"));
	$("#preview_data").html("Current stream: " + remoteCall("currentPreview"));
}

function switchStream(stream) {
	if(!stream || !$.trim(stream)) {
		alert("Can't change to empty stream");
		return false;
	}
	if(!remoteCall("switchStream", stream)) {
		alert("Warning, SwitchStream is not enabled on the server");
	}
	updateStreamInfo();
}

function publish() {
	if(!remoteCall("publishStream")) {
		alert("Warning, SwitchStream is not enabled on the server");
	}
	updateStreamInfo();
}

function updateStreamList() {
	var streams = remoteCall('getStreams');

	var $list = $("#preview_stream_list")

	$list.html("");

	$.each(streams, function(idx, stream) {
		$list.append("<option>"+stream+"</option>")
	})
}
