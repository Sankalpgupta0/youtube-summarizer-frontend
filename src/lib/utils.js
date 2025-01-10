import axios from 'axios';

export async function getTranscript(videoUrl) {
    const response = await axios.get(`http://192.168.0.109:8000/api/?youtube_video_url=${videoUrl}`);
    console.log(response.data);
    return response.data;
};

export async function logout() {
    try {
        // Clear any auth tokens from localStorage
        localStorage.removeItem('isLogin');
        
        // If you have a backend logout endpoint, you can call it here
        // await axios.post('http://127.0.0.1:8000/api/logout/');
        
        // Redirect to login page
        window.location.href = '/';
    } catch (error) {
        console.error('Logout failed:', error);
    }
}
