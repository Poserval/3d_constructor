// capacitor-download.js
(function() {
    if (window.Capacitor && window.Capacitor.isNativePlatform) {
        console.log('⚡ Capacitor native mode active');
        const { Filesystem, Directory } = window.Capacitor.Plugins;

        window.capacitorSaveFile = async function(blob, fileName) {
            try {
                // 1. Сохраняем файл во временную папку приложения (Directory.Cache)
                // Это единственное место, куда Capacitor умеет писать[citation:8]
                const result = await Filesystem.writeFile({
                    path: fileName,
                    data: blob,
                    directory: Directory.Cache,
                    recursive: true
                });
                console.log('File saved to cache:', result.uri);

                // 2. Нужно динамически импортировать FileOpener,
                // чтобы избежать ошибок, если плагин не установлен
                const { FileOpener } = await import('@capacitor-community/file-opener');
                const mimeType = getMimeType(fileName);

                // 3. Открываем файл через FileOpener.
                // Это вызовет системный диалог "Открыть с помощью",
                // где можно будет сохранить файл через "Сохранить в..."
                await FileOpener.open({
                    filePath: result.uri,
                    contentType: mimeType
                });
                console.log('File opened successfully');

            } catch (error) {
                console.error('Download error:', error);
                alert('❌ Ошибка при сохранении файла. Проверьте логи.');
            }
        };

        function getMimeType(fileName) {
            const ext = fileName.split('.').pop().toLowerCase();
            const mimeTypes = {
                'stl': 'application/vnd.ms-pki.stl',
                'obj': 'text/plain',
                'glb': 'model/gltf-binary',
                'gltf': 'model/gltf+json',
                'txt': 'text/plain'
            };
            return mimeTypes[ext] || 'application/octet-stream';
        }
    }
})();
