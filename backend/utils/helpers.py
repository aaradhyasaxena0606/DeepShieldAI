# VoiceGuard AI - Helper Utilities
# save_temp_file(upload_file): Save UploadFile to temp directory, return path, auto-cleanup after 1 hour
# format_error_response(error): Convert exception to standardized JSON error format
# calculate_processing_time(start_time): Return milliseconds elapsed since start_time

def normalize_confidence(value: float) -> float:
    return max(0.0, min(1.0, value))
