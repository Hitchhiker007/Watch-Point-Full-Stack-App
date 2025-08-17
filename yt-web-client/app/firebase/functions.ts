import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');

const getVideosFunction = httpsCallable(functions, 'getVideos');

const getUserPhotoFunction = httpsCallable(functions, 'getUserPhotoUrl');

const getUserEmailFunction = httpsCallable(functions, 'getUserEmail');

// Callable functions
const generateUploadUrlFn = httpsCallable<
  { fileExtension: string; title: string; description: string; genre: string },
  { url: string; fileName: string }
>(functions, "generateUploadUrl");

export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    status?: 'processing' | 'processed',
    title?: string,
    description?: string,
    genre?: string
}

export interface VideoMetadata {
  title: string;
  description: string;
  genre: string;
}

export interface UserPhotoResponse {
    photoURL: string;
}

export interface UserEmailResponse {
    email: string;
}


// Define the expected structure of the response from generateUploadUrl
interface GenerateUploadUrlResponse {
    url: string; // The URL will be directly on the response, not inside a 'data' object
}

// Function to upload a video using the signed URL
export async function uploadVideo(file: File, metadata: VideoMetadata) {
    // Call Firebase function to generate signed URL & create Firestore doc with metadata
  const response = await generateUploadUrlFn({
    fileExtension: file.name.split(".").pop() || "mp4",
    ...metadata,
  });

  const { url } = response.data;

    // Upload the file to the signed URL
  await fetch(url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });
}


export async function getVideos() {
    const response = await getVideosFunction();
    return response.data as Video[];
}

export async function getPhotoUrl(): Promise<string> {
    const response = await getUserPhotoFunction();

    console.log("Photo Url Response");
    console.log(response.data);

    // Safely cast response data to UserPhotoResponse
    const data = response.data as UserPhotoResponse | undefined;

    // Check if data is valid before accessing the photoURL
    return data?.photoURL || ""; // Default to empty string if photoURL is not available
}

export async function getUserEmail(): Promise<string> {
    const response = await getUserEmailFunction();

    console.log("User Email Response");
    console.log(response.data);

    const data = response.data as UserEmailResponse | undefined;

    return data?.email || "";
}



