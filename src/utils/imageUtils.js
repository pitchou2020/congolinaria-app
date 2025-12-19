import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

export async function processAndCacheImage(uri) {
  // 1️⃣ Comprimir e redimensionar
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1200 } }],
    { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG }
  );

  // 2️⃣ Salvar no cache local do app
  const fileName = `recipe_${Date.now()}.jpg`;
  const newPath = FileSystem.cacheDirectory + fileName;

  await FileSystem.copyAsync({
    from: result.uri,
    to: newPath,
  });

  return newPath;
}
