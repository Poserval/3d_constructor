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
                    await Filesystem.writeFile({
                        path: fileName,
                        data: base64,
                        directory: Directory.Cache,
                        recursive: true
                    });
                    
                    // Получаем URI файла
                    const uriResult = await Filesystem.getUri({
                        path: fileName,
                        directory: Directory.Cache
                    });
                    
                    console.log('File URI:', uriResult.uri);
                    
                    // Открываем файл через Intent (стандартный Capacitor)
                    const { App } = window.Capacitor.Plugins;
                    
                    // Используем App.openURL для открытия файла
                    await App.openURL({
                        url: uriResult.uri
                    });
                    
                    alert('✅ Файл готов к сохранению');
                };
                reader.readAsDataURL(blob);
                
            } catch (error) {
                console.error('Download error:', error);
                alert('❌ Ошибка: ' + error.message);
            }
        };
    }
})();
