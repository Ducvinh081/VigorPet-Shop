import cloudinary from '@/libs/cloudinary';
import uniqid from 'uniqid';

export async function POST(req) {
  const data = await req.formData();
  const file = data.get('file');
  const chunks = [];
  for await (const chunk of file.stream()) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  const base64String = buffer.toString('base64');
  const dataURI = `data:${file.type};base64,${base64String}`;

  const result = await cloudinary.uploader.upload(dataURI, {
    folder: 'VigorPet',
    public_id: uniqid(),
  });

  return Response.json(result);

}
