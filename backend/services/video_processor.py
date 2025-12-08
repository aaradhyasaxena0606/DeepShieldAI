# VoiceGuard AI - Video Processing Service
# Extract audio from video files using moviepy
# Returns audio bytes in MP3 format for analysis

import io
import tempfile
import os
from pathlib import Path
from typing import Tuple

def extract_audio_from_video(video_bytes: bytes, video_filename: str = "video.mp4") -> Tuple[bytes, str]:
    """
    Extract audio from video bytes and return as MP3 bytes.
    
    Args:
        video_bytes: Raw video file bytes
        video_filename: Original filename (used to determine format)
        
    Returns:
        Tuple of (audio_bytes, audio_format) where audio_format is "mp3"
        
    Raises:
        Exception: If video processing fails
    """
    try:
        from moviepy.editor import VideoFileClip
    except ImportError:
        raise ImportError("moviepy is required for video processing. Install with: pip install moviepy")
    
    # Create temporary files for video input and audio output
    with tempfile.TemporaryDirectory() as tmpdir:
        temp_video_path = os.path.join(tmpdir, video_filename)
        temp_audio_path = os.path.join(tmpdir, "audio.mp3")
        
        # Write video bytes to temporary file
        with open(temp_video_path, "wb") as f:
            f.write(video_bytes)
        
        print(f"[VideoProcessor] Processing video file: {video_filename}")
        print(f"[VideoProcessor] Video size: {len(video_bytes)} bytes")
        
        # Extract audio using moviepy
        try:
            video_clip = VideoFileClip(temp_video_path)
            
            # Check if video has audio
            if video_clip.audio is None:
                video_clip.close()
                raise ValueError("Video file does not contain an audio track")
            
            # Extract audio and save as MP3
            audio_clip = video_clip.audio
            audio_clip.write_audiofile(
                temp_audio_path,
                codec='mp3',
                bitrate='128k',
                logger=None  # Suppress moviepy output
            )
            
            # Clean up
            audio_clip.close()
            video_clip.close()
            
            # Read the extracted audio
            with open(temp_audio_path, "rb") as f:
                audio_bytes = f.read()
            
            print(f"[VideoProcessor] Audio extracted successfully")
            print(f"[VideoProcessor] Audio size: {len(audio_bytes)} bytes")
            
            return audio_bytes, "mp3"
            
        except Exception as e:
            print(f"[VideoProcessor] Error during video processing: {e}")
            raise Exception(f"Failed to extract audio from video: {str(e)}")
