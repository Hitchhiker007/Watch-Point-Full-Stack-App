import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');

const getVideosFunction = httpsCallable(functions, 'getVideos');

export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    status?: 'processing' | 'processed',
    title?: string,
    description?: string
}


// Define the expected structure of the response from generateUploadUrl
interface GenerateUploadUrlResponse {
    url: string; // The URL will be directly on the response, not inside a 'data' object
}

// Function to upload a video using the signed URL
export async function uploadVideo(file: File) {
    // Call the Firebase function and assert that response.data is of type GenerateUploadUrlResponse
    const response = await generateUploadUrl({
        fileExtension: file.name.split('.').pop()
    });

    // TypeScript now understands that response.data has the correct shape
    const uploadUrl = (response.data as GenerateUploadUrlResponse).url;

    // Upload the file via the signed URL
    const uploadResult = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': file.type
        }
    });

    return uploadResult;
}


export async function getVideos() {
    const response = await getVideosFunction();
    return response.data as Video[];
}

