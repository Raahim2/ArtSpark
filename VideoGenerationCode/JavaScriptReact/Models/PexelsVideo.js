import {PEXELS_API_KEY} from '@env'

const getVideosAndDurations = async (query, numVideo, targetAspectRatio = 16 / 9, tolerance = 0.1) => {
    const endpoint = 'https://api.pexels.com/videos/search';
    
    const headers = {
        'Authorization': PEXELS_API_KEY,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537/36'
    };
    
    const params = new URLSearchParams({
        'query': query,
        'per_page': numVideo
    });
    
    try {
        const response = await fetch(`${endpoint}?${params.toString()}`, {
            method: 'GET',
            headers: headers
        });

        if (response.ok) {
            const data = await response.json();
            const videos = data.videos || [];
            
            if (videos.length > 0) {
                const videoInfo = videos.map(video => {
                    const width = video.video_files[0]?.width;
                    const height = video.video_files[0]?.height;
                    
                    if (width && height) {
                        const aspectRatio = width / height;
                        if (Math.abs(aspectRatio - targetAspectRatio) < tolerance) {
                            const videoUrl = video.video_files[0].link;
                            const duration = video.duration || 0;
                            return { videoUrl, duration };
                        }
                    }
                    return null;
                }).filter(video => video !== null);
                
                if (videoInfo.length > 0) {
                    return videoInfo;
                } else {
                    console.log("No videos with the specified aspect ratio found.");
                    return [];
                }
            } else {
                console.log("No videos found.");
                return [];
            }
        } else {
            console.log(`Failed to retrieve videos. Status code: ${response.status}`);
            return [];
        }
    } catch (error) {
        console.error("Error fetching videos from Pexels:", error);
        return [];
    }
};

module.exports = getVideosAndDurations;
