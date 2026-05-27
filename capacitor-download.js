// capacitor-download.js
(function() {
    if (window.Capacitor && window.Capacitor.isNativePlatform) {
        console.log('⚡ Capacitor native mode active');
        
        const { Filesystem, Directory } = window.Capacitor.Plugins;
        
        window.capacitorSaveFile = async function(blob, fileName) {
            try {
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const base64 = reader.result.split(',')[1];
                    
                    // Сохраняем файл в кэш приложения
                    const result = await Filesystem.writeFile({
                        path: fileName,
                        data: base64,
                        directory: Directory.Cache,
                        recursive: true
                    });
                    
                    console.log('File saved to cache:', result.uri);
                    
                    // Создаём временную ссылку и открываем в браузере
                    // Это вызовет системный диалог сохранения
                    window.open(result.uri, '_blank');
                    
                    alert('✅ Файл готов к сохранению');
                };
                reader.readAsDataURL(blob);
                
            } catch (error) {
                console.error('Download error:', error);
                alert('❌ Ошибка: ' + error.message);
            }
        };
        
        function getMimeType(fileName) {
            const ext = fileName.split('.').pop().toLowerCase();
            const mimeTypes = {
                'stl': 'application/sla',
                'obj': 'text/plain',
                'glb': 'model/gltf-binary',
                'gltf': 'model/gltf+json',
                'txt': 'text/plain'
            };
            return mimeTypes[ext] || 'application/octet-stream';
        }
    }
})();
