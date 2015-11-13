function startAudioRecord() {
	audio.doStartRecord();//Comenzar a grabar
}

function stopAudioRecord(i) {
	var fileFolder=appConstants.localPermanentStorageFolderAudio();
	var fileName="audio-"+i+".3gp";
	audio.doStopRecordAsync(
		fileFolder,
		fileName,
		//Se ejecuta si ha ido todo bien
		function () {
			destino=audio.fileFolder+audio.fileName;//Guardar la ubicación del fichero de solución donde corresponda, según el ejercicio   		
			$("#audioSrc-"+i).attr("src",destino);//Rellenar el atributo src del elemento de audio correspondiente
			$("#audio-prueba-"+i).trigger("load");//Realiza que se carge el fichero
			$("#audio-prueba-"+i).show();//Visualizar el elemento de audio
		}
	);
}