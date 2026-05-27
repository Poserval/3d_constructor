// Перехват скачивания для Capacitor
(function() {
    if (window.Capacitor && window.Capacitor.isNativePlatform) {
        console.log('⚡ Running in Capacitor native mode');
        
        // Сохраняем оригинальную функцию saveFile
        const originalSaveFile = window.saveFile;
        
        // Переопределяем для Capacitor
        window.saveFile = async function(blob, fileName) {
            try {
                const { Filesystem } = window.Capacitor.Plugins;
                
                // Читаем blob как base64
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const base64 = reader.result;
                    await Filesystem.writeFile({
                        path: fileName,
                        data: base64,
                        directory: 1 // Downloads directory
                    });
                    showMessage('✅ Файл сохранён: ' + fileName);
                };
                reader.readAsDataURL(blob);
            } catch (error) {
                console.error('Download error:', error);
                showMessage('❌ Ошибка сохранения');
            }
        };
    }
})();
