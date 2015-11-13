var appConstants = {
	localPermanentStorageFolder: "/sdcard/refugiapp/",
	localPermanentStorageFolderAudio: function () {
		return this.localPermanentStorageFolder+"audio/";
	}
};

var audio = {
		media:null,
		fileFolder:null,
		fileName:null,
		//debemos crear un objeto medio sobre el que trabajar
		create: function(fileFolder,fileName) {
			this.fileFolder=fileFolder;
			this.fileName=fileName;
			if(this.media){
				//Liberamos si existe un objeto media usado
				this.media.release();
			}
				
			this.media=new Media(this.fileFolder+this.fileName);//Crear nuevo objeto media del fichero fileName de fileFolder y guardarlo en el atributo media
		},
		//metodo para empezar a grabar
		doStartRecord: function() {
			this.create("","tmprecording.3gp");//Crear nuevo objeto para el atributo media, del fichero "tmprecording.3gp" de la carpeta por defecto
			if(this.media) {
		        this.media.startRecord();//Comenzar a grabar con el objeto del atributo media
		    }
			else {
				alert("No hay ningun archivo multimedia para grabar.");
			}		
		},
		//Se le pasa la carpeta donde queremos guardado, lo que queremos que se ejecute una vez grabado
		doStopRecordAsync: function(fileFolder,fileName,onSuccess) {
			if(this.media) {
		        this.media.stopRecord();//Dejar de grabar con el objeto del atributo media
		    
		        fileUtilities.moveAsync(
						"/sdcard/tmprecording.3gp",fileFolder,fileName,//Mover el fichero de grabación creado "/sdcard/tmprecording.3gp", a la carpeta fileFolder, con nombre fileName
						//"tmprecording.3gp",fileFolder,fileName,//Mover el fichero de grabación creado "/sdcard/tmprecording.3gp", a la carpeta fileFolder, con nombre fileName
		        	function() {//función successCallback: si el fichero se ha movido
			    		audio.media.release();//Liberar el objeto del atributo media
						audio.fileFolder=fileFolder;//Guardar en el atributo fileFolder del objeto audio, la carpeta destino
						audio.fileName=fileName;//Guardar en el atributo fileName del objeto audio, el nuevo nombre del fichero
						if(onSuccess!=false)
							onSuccess();
		        	}
		        );
			}
			else {
				alert("No hay ningun archivo multimedia para detener.");
			}		
		}		
};

var fileUtilities = {
		moveAsync: function (sourceFullPath,destFolder,destName,onSuccess){
			
			var url="file://"+sourceFullPath;
			var destFile=destFolder+destName;
			var ft=new FileTransfer();//Crear objeto FileTransfer
		    ft.download(//Copiar (descargar) el fichero indicado por URL en destFile
				url,
				destFile,
		    	function() {//función successCallback: si el fichero se descargó bien
					window.resolveLocalFileSystemURL(url,//Acceder al fichero original por su URL
		    				function(fileEntry) {//función successCallback: si se ha podido acceder al fichero original
								fileEntry.remove(onSuccess);//Borrar el fichero y seguir con onSuccess
		    				},
		    				function(error) {
		    					alert("Archivo de origen NO accesible; no se ha removido");
		    				}
		    		);			
				},
				function(error) {
					alert('Archivo no copiado. '+'error.code: '+error.code+'\nerror.source: '+error.source+'\nerror.target: '+error.target+'\nerror.http_status: '+error.http_status);
				}
			);
		}
};