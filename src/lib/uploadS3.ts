export async function uploadTechnologyImage(image: File, presignedURL: string): Promise<string> {
  try {
    // Prepare the form data to be sent to S3
    const formData = new FormData();
    formData.append("file", image);

    // Upload the file to S3 using a POST request
    const response = await fetch(presignedURL, {
      method: "PUT", // Use "PUT" method if the pre-signed URL is for a PUT request
      body: image, // Send the image directly if the URL is for PUT
      headers: {
        "Content-Type": image.type, // Set the correct content type for the image
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    const publicUrl = presignedURL.split("?")[0];

    // Return the public URL
    return publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}
